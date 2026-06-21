import { Router, type Request, type Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getBillingSchedulerStatus,
  triggerBillingNow,
} from '../services/billing/billing.scheduler'
import {
  getUserBillingHistory,
  getTotalBilled,
} from '../services/billing/billing.queries'
import { getQueueStats } from '../queue/queues'
import { prisma } from '../db/client'
import {
  TIER_DEFINITIONS,
  getCurrentTier,
  changeTier,
  getSubscriptionHistory,
} from '../services/billing/subscription.service'

const router = Router()

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

function isAdmin(req: Request): boolean {
  const email = (req as any).user?.email?.toLowerCase()
  return !!email && ADMIN_EMAILS.includes(email)
}

//  GET /api/billing/history 
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const [history, totalBilled] = await Promise.all([
      getUserBillingHistory((req as any).user.userId),
      getTotalBilled((req as any).user.userId),
    ])
    res.json({
      history: history.map((r) => ({
        id: r.id,
        amountUsd: Number(r.amountUsd),
        storageBytes: Number(r.storageBytes),
        gbHours: Number(r.gbHours),
        periodStart: r.periodStart,
        periodEnd: r.periodEnd,
        createdAt: r.createdAt,
      })),
      totalBilled,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch billing history' })
  }
})

//  GET /api/billing/status ─
router.get('/status', authMiddleware, (_req, res) => {
  res.json(getBillingSchedulerStatus())
})

//  GET /api/billing/queue 
router.get('/queue', authMiddleware, async (_req, res) => {
  try {
    const stats = await getQueueStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queue stats' })
  }
})

//  POST /api/billing/run — admin-only, dev-only 
router.post('/run', authMiddleware, async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Manual billing disabled in production' })
    return
  }

  if (!isAdmin(req)) {
    res.status(403).json({ error: 'Admin access required' })
    return
  }

  try {
    const result = await triggerBillingNow()
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// SUBSCRIPTION ENDPOINTS

//  GET /api/billing/tiers — list available subscription tiers 
router.get('/tiers', async (_req: Request, res: Response) => {
  res.json({ tiers: TIER_DEFINITIONS })
})

//  GET /api/billing/subscription — current user's tier + status 
router.get('/subscription', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        subscriptionRenewsAt: true,
        balance: { select: { amountUsd: true } },
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const tier = TIER_DEFINITIONS.find(t => t.id === user.subscriptionTier)
    const balanceUsd = user.balance ? Number(user.balance.amountUsd) : 0

    res.json({
      currentTier: user.subscriptionTier,
      tierDetails: tier,
      renewsAt: user.subscriptionRenewsAt,
      balanceUsd,
      canAffordRenewal: tier ? balanceUsd >= tier.monthlyPriceUsd : true,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription status' })
  }
})

//  POST /api/billing/subscription — change tier ─
router.post('/subscription', authMiddleware, async (req: Request, res: Response) => {
  const { tier } = req.body
  const validTiers = TIER_DEFINITIONS.map(t => t.id)

  if (!tier || !validTiers.includes(tier)) {
    res.status(400).json({ error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` })
    return
  }

  try {
    const result = await changeTier((req as any).user.userId, tier)
    res.json(result)
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'INSUFFICIENT_BALANCE') {
      res.status(402).json({ error: 'Insufficient balance to upgrade. Add funds first.' })
      return
    }
    console.error('[billing/subscription]', err)
    res.status(500).json({ error: 'Failed to change subscription tier' })
  }
})

//  GET /api/billing/subscription/history ─
router.get('/subscription/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const history = await getSubscriptionHistory((req as any).user.userId)
    res.json({
      history: history.map(r => ({
        id: r.id,
        tier: r.tier,
        amountUsd: Number(r.amountUsd),
        periodStart: r.periodStart,
        periodEnd: r.periodEnd,
        status: r.status,
        createdAt: r.createdAt,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscription history' })
  }
})

export default router