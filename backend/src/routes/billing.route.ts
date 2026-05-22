import { Router, type Request, type Response } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { getBillingSchedulerStatus, triggerBillingNow } from '../services/billing/billing.scheduler'
import { getUserBillingHistory, getTotalBilled } from '../services/billing/billing.queries'
import { getQueueStats } from '../queue/queues'

const router = Router()

router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const [history, totalBilled] = await Promise.all([
      getUserBillingHistory(req.user!.userId),
      getTotalBilled(req.user!.userId),
    ])
    res.json({
      history: history.map(r => ({
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

router.get('/status', authMiddleware, (_req, res) => {
  res.json(getBillingSchedulerStatus())
})

router.get('/queue', authMiddleware, async (_req, res) => {
  try {
    const stats = await getQueueStats()
    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queue stats' })
  }
})

router.post('/run', authMiddleware, async (_req, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Manual billing disabled in production' })
    return
  }
  try {
    const result = await triggerBillingNow()
    res.json(result)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
