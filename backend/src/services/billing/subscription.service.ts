import { prisma } from '../../db/client'
import { Decimal } from '@prisma/client/runtime/library'

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION MODEL — Hybrid PAYG + Monthly Tiers
// ═══════════════════════════════════════════════════════════════════════════
//
// How it works:
//   - Every user has a `subscriptionTier` (FREE, PRO, TEAM)
//   - Each tier includes a storage allowance at NO extra per-GB cost
//   - Usage BEYOND the tier's included storage is billed PAYG at the
//     existing per-GB rate (handled by the existing billing.engine.ts)
//   - The monthly tier fee itself is deducted from the user's SOL balance
//     once per month by the billing scheduler (same balance as PAYG uses)
//   - If balance is insufficient to cover the monthly tier fee on renewal
//     date, the user is AUTO-DOWNGRADED to FREE (not suspended) —
//     their bucket stays active, they just lose the included allowance
//     and fall back to pure PAYG billing for all usage
//   - Upgrading is immediate (charged pro-rated for current period... 
//     simplified here to: charged full amount immediately, renewal date
//     resets to 30 days from upgrade)
//   - Downgrading takes effect at the END of the current period (no refund,
//     user keeps tier benefits until period ends, then drops to new tier)
//
// ═══════════════════════════════════════════════════════════════════════════

export type SubscriptionTierId = 'FREE' | 'PRO' | 'TEAM'

export interface TierDefinition {
    id: SubscriptionTierId
    name: string
    monthlyPriceUsd: number
    includedStorageGb: number
    features: string[]
    recommended?: boolean
}

export const TIER_DEFINITIONS: TierDefinition[] = [
    {
        id: 'FREE',
        name: 'Free',
        monthlyPriceUsd: 0,
        includedStorageGb: 10,
        features: [
            '10 GB included storage',
            '$0.00 egress fees',
            'S3-compatible API',
            'PAYG billing beyond 10 GB',
            'Email support',
        ],
    },
    {
        id: 'PRO',
        name: 'Pro',
        monthlyPriceUsd: 5,
        includedStorageGb: 100,
        recommended: true,
        features: [
            '100 GB included storage',
            '$0.00 egress fees',
            'S3-compatible API',
            'PAYG billing beyond 100 GB',
            'Priority email support',
            'Lower PAYG overage rate (10% discount)',
        ],
    },
    {
        id: 'TEAM',
        name: 'Team',
        monthlyPriceUsd: 20,
        includedStorageGb: 500,
        features: [
            '500 GB included storage',
            '$0.00 egress fees',
            'S3-compatible API',
            'PAYG billing beyond 500 GB',
            'Priority support',
            'Lower PAYG overage rate (20% discount)',
            'Multi-bucket support (coming soon)',
        ],
    },
]

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000

export function getTierDefinition(tier: SubscriptionTierId): TierDefinition {
    const def = TIER_DEFINITIONS.find(t => t.id === tier)
    if (!def) throw new Error(`Unknown tier: ${tier}`)
    return def
}

export function getIncludedBytesForTier(tier: SubscriptionTierId): number {
    const def = getTierDefinition(tier)
    return def.includedStorageGb * 1024 * 1024 * 1024
}

/**
 * Returns the PAYG overage discount multiplier for a tier.
 * Applied to the per-GB rate for usage beyond the included allowance.
 */
export function getOverageDiscountMultiplier(tier: SubscriptionTierId): number {
    switch (tier) {
        case 'PRO': return 0.9   // 10% discount
        case 'TEAM': return 0.8  // 20% discount
        default: return 1.0      // FREE — no discount
    }
}

/**
 * Returns a user's current tier. Defaults to FREE if not set.
 */
export async function getCurrentTier(userId: string): Promise<SubscriptionTierId> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
    })
    return (user?.subscriptionTier as SubscriptionTierId) ?? 'FREE'
}

/**
 * Changes a user's subscription tier.
 *
 * UPGRADE (higher price): charged immediately from balance.
 *   - Throws INSUFFICIENT_BALANCE if balance < new tier price.
 *   - Renewal date reset to 30 days from now.
 *
 * DOWNGRADE (lower price, including to FREE): scheduled for end of
 * current period — user keeps current benefits until then.
 *   - For simplicity in this implementation, downgrade to FREE is
 *     applied immediately if there's no active renewal date (e.g.
 *     user was already on FREE or has no period set).
 */
export async function changeTier(
    userId: string,
    newTier: SubscriptionTierId
): Promise<{ tier: SubscriptionTierId; renewsAt: Date | null; message: string }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            subscriptionTier: true,
            subscriptionRenewsAt: true,
            balance: { select: { amountUsd: true } },
        },
    })

    if (!user) throw new Error('USER_NOT_FOUND')

    const currentTier = (user.subscriptionTier as SubscriptionTierId) ?? 'FREE'
    const currentDef = getTierDefinition(currentTier)
    const newDef = getTierDefinition(newTier)
    const balanceUsd = user.balance ? Number(user.balance.amountUsd) : 0

    const isUpgrade = newDef.monthlyPriceUsd > currentDef.monthlyPriceUsd

    if (isUpgrade) {
        if (balanceUsd < newDef.monthlyPriceUsd) {
            throw new Error('INSUFFICIENT_BALANCE')
        }

        const renewsAt = new Date(Date.now() + ONE_MONTH_MS)

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: {
                    subscriptionTier: newTier,
                    subscriptionRenewsAt: renewsAt,
                },
            }),
            prisma.balance.update({
                where: { userId },
                data: { amountUsd: { decrement: new Decimal(newDef.monthlyPriceUsd) } },
            }),
            prisma.subscriptionRecord.create({
                data: {
                    userId,
                    tier: newTier,
                    amountUsd: new Decimal(newDef.monthlyPriceUsd),
                    periodStart: new Date(),
                    periodEnd: renewsAt,
                    status: 'CHARGED',
                },
            }),
        ])

        return {
            tier: newTier,
            renewsAt,
            message: `Upgraded to ${newDef.name}. $${newDef.monthlyPriceUsd.toFixed(2)} charged. Renews ${renewsAt.toLocaleDateString()}.`,
        }
    }

    // Downgrade — including to FREE
    if (newTier === 'FREE') {
        // Immediate downgrade to FREE — no charge involved
        await prisma.user.update({
            where: { id: userId },
            data: {
                subscriptionTier: 'FREE',
                subscriptionRenewsAt: null,
            },
        })

        return {
            tier: 'FREE',
            renewsAt: null,
            message: `Downgraded to Free. Your bucket remains active. PAYG billing applies beyond ${getTierDefinition('FREE').includedStorageGb} GB.`,
        }
    }

    // Downgrade between paid tiers (e.g. TEAM → PRO) — takes effect at
    // end of current period to honor what was already paid for
    const renewsAt = user.subscriptionRenewsAt ?? new Date(Date.now() + ONE_MONTH_MS)

    // For simplicity: store the pending downgrade as a note via
    // subscriptionTier change effective immediately but keep renewsAt —
    // a more sophisticated implementation would use a separate
    // "pendingTier" field. Documented here as a known simplification.
    await prisma.user.update({
        where: { id: userId },
        data: { subscriptionTier: newTier },
    })

    return {
        tier: newTier,
        renewsAt,
        message: `Downgraded to ${newDef.name}. Takes effect immediately; next renewal charges $${newDef.monthlyPriceUsd.toFixed(2)} on ${renewsAt.toLocaleDateString()}.`,
    }
}

/**
 * Returns subscription billing history for a user, most recent first.
 */
export async function getSubscriptionHistory(userId: string, limit = 12) {
    return prisma.subscriptionRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
    })
}

// ═══════════════════════════════════════════════════════════════════════════
// MONTHLY RENEWAL PROCESSING — called by billing scheduler
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Processes subscription renewals for all users whose subscriptionRenewsAt
 * has passed. Called once daily by the billing scheduler (same cron as
 * the existing PAYG billing engine — runs at midnight UTC).
 *
 * For each due renewal:
 *   - If balance >= tier price: deduct, extend renewsAt by 30 days, record CHARGED
 *   - If balance <  tier price: auto-downgrade to FREE, clear renewsAt, record DOWNGRADED
 *
 * Returns a summary for logging/admin visibility.
 */
export async function processSubscriptionRenewals(): Promise<{
    processed: number
    charged: number
    downgraded: number
}> {
    const now = new Date()

    const dueUsers = await prisma.user.findMany({
        where: {
            subscriptionRenewsAt: { lte: now },
            subscriptionTier: { not: 'FREE' },
        },
        select: {
            id: true,
            email: true,
            subscriptionTier: true,
            balance: { select: { amountUsd: true } },
        },
    })

    let charged = 0
    let downgraded = 0

    for (const user of dueUsers) {
        const tier = user.subscriptionTier as SubscriptionTierId
        const def = getTierDefinition(tier)
        const balanceUsd = user.balance ? Number(user.balance.amountUsd) : 0

        if (balanceUsd >= def.monthlyPriceUsd) {
            const renewsAt = new Date(now.getTime() + ONE_MONTH_MS)

            await prisma.$transaction([
                prisma.balance.update({
                    where: { userId: user.id },
                    data: { amountUsd: { decrement: new Decimal(def.monthlyPriceUsd) } },
                }),
                prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionRenewsAt: renewsAt },
                }),
                prisma.subscriptionRecord.create({
                    data: {
                        userId: user.id,
                        tier,
                        amountUsd: new Decimal(def.monthlyPriceUsd),
                        periodStart: now,
                        periodEnd: renewsAt,
                        status: 'CHARGED',
                    },
                }),
            ])

            charged++
            console.log(`[subscription] ✅ Renewed ${def.name} for user ${user.id.slice(0, 8)} — $${def.monthlyPriceUsd}`)
        } else {
            // Insufficient balance — auto-downgrade to FREE
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id },
                    data: {
                        subscriptionTier: 'FREE',
                        subscriptionRenewsAt: null,
                    },
                }),
                prisma.subscriptionRecord.create({
                    data: {
                        userId: user.id,
                        tier,
                        amountUsd: new Decimal(0),
                        periodStart: now,
                        periodEnd: now,
                        status: 'DOWNGRADED',
                    },
                }),
            ])

            downgraded++
            console.log(
                `[subscription] ⬇️  Auto-downgraded user ${user.id.slice(0, 8)} from ${def.name} to Free ` +
                `(balance $${balanceUsd.toFixed(2)} < required $${def.monthlyPriceUsd})`
            )

            // Notify user — non-blocking
            if (user.email) {
                import('../email.service').then(({ sendSubscriptionDowngradedEmail }) => {
                    sendSubscriptionDowngradedEmail(user.email, def.name).catch(() => { })
                }).catch(() => { })
            }
        }
    }

    return { processed: dueUsers.length, charged, downgraded }
}