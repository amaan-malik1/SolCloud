import { Router, type Request, type Response } from 'express'
import { checkSolanaConnection } from '../services/solana.connection'
import { getPlatformAddress, getPlatformBalance } from '../services/wallet.service'
import { authMiddleware } from '../middleware/auth.middleware'
import { getIndexerStatus } from '../services/indexer.service'

const router = Router()

router.get('/status', async (_req: Request, res: Response) => {
  const connected = await checkSolanaConnection()
  res.json({ connected, network: process.env.SOLANA_NETWORK, platformAddress: getPlatformAddress() })
})

router.get('/balance', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const balance = await getPlatformBalance()
    res.json({ address: getPlatformAddress(), balanceSol: balance })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' })
  }
})

router.get('/indexer/status', authMiddleware, (_req, res) => {
  res.json(getIndexerStatus())
})

export default router
