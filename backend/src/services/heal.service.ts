import { prisma } from '../db/client'
import { queueProvisionStorage } from '../queue/queues'

/**
 * Finds users who have a positive balance but no provisioned bucket
 * (e.g. worker failed permanently, or job was lost during a Redis flush)
 * and re-queues provisioning for them.
 *
 * Called:
 *   1. On backend startup (with a short delay for worker to be ready)
 *   2. On every /api/auth/me call (cheap per-user check, catches issues
 *      fast for the specific user currently active)
 */
export async function healUnprovisionedUsers(): Promise<{ healed: number }> {
    const balances = await prisma.balance.findMany({
        where: { amountUsd: { gt: 0 } },
        select: { userId: true },
    })

    let healed = 0

    for (const { userId } of balances) {
        const bucket = await prisma.bucket.findUnique({
            where: { userId },
            select: { id: true },
        })

        if (!bucket) {
            console.log(`[heal] Queuing missed provision for user ${userId.slice(0, 8)}`)
            await queueProvisionStorage({
                userId,
                txSignature: `heal-${Date.now()}`,
                solAmount: 0,
                usdAmount: 0,
                solPriceUsd: 0,
            }).catch(err => console.error(`[heal] Failed to queue for ${userId.slice(0, 8)}:`, err.message))
            healed++
        }
    }

    if (healed > 0) {
        console.log(`[heal] Startup heal complete — queued ${healed} user(s)`)
    }

    return { healed }
}

/**
 * Single-user heal check — used in /api/auth/me to catch issues
 * for the currently logged-in user without scanning everyone.
 */
export async function healSingleUser(userId: string): Promise<boolean> {
    const [balance, bucket] = await Promise.all([
        prisma.balance.findUnique({ where: { userId }, select: { amountUsd: true } }),
        prisma.bucket.findUnique({ where: { userId }, select: { id: true } }),
    ])

    const hasBalance = Number(balance?.amountUsd ?? 0) > 0

    if (hasBalance && !bucket) {
        console.log(`[heal] User ${userId.slice(0, 8)} has balance but no bucket — re-queuing`)
        await queueProvisionStorage({
            userId,
            txSignature: `heal-${Date.now()}`,
            solAmount: 0,
            usdAmount: 0,
            solPriceUsd: 0,
        }).catch(err => console.error('[heal] Queue failed:', err.message))
        return true
    }

    return false
}