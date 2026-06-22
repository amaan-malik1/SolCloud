import { Router, type Request, type Response } from 'express'
import { processTransaction } from '../services/indexer.service'

const router = Router()

const WEBHOOK_SECRET = process.env.HELIUS_WEBHOOK_SECRET

router.post('/webhook', async (req: Request, res: Response) => {
    // ── Verify the request is actually from Helius 
    if (WEBHOOK_SECRET) {
        const authHeader = req.headers['authorization']
        if (authHeader !== WEBHOOK_SECRET) {
            console.warn('[webhook] Rejected request with invalid auth header')
            res.status(401).json({ error: 'Unauthorized' })
            return
        }
    }

    // Helius sends an array of transaction events, even for a single tx
    const events = Array.isArray(req.body) ? req.body : [req.body]

    if (events.length === 0) {
        res.sendStatus(200)
        return
    }

    console.log(`[webhook] Received ${events.length} transaction event(s) from Helius`)

    // Respond to Helius immediately — don't make it wait for processing.
    // If processing fails, your startup recovery scan will catch it on
    // next restart, and Helius doesn't need to retry indefinitely.
    res.sendStatus(200)

    // Process each transaction signature asynchronously
    for (const event of events) {
        const signature = event.signature
        if (!signature) {
            console.warn('[webhook] Event missing signature, skipping:', JSON.stringify(event).slice(0, 200))
            continue
        }

        try {
            await processTransaction(signature)
        } catch (err: any) {
            console.error(`[webhook] Failed to process ${signature.slice(0, 20)}:`, err.message)
        }
    }
})

export default router