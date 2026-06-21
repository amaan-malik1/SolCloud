import { prisma } from '../db/client'
import { queueProvisionStorage } from '../queue/queues'

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