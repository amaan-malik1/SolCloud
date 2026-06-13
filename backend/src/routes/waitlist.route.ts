import { Router, type Request, type Response } from 'express'
import { prisma } from '../db/client'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email || !email.includes('@')) {
        res.status(400).json({ error: 'Valid email required' })
        return
    }

    try {
        // Check if already exists
        const existing = await prisma.waitlist.findUnique({
            where: { email: email.toLowerCase().trim() }
        })
        if (existing) {
            const count = await prisma.waitlist.count()
            res.json({ message: 'Already on waitlist', position: count })
            return
        }

        await prisma.waitlist.create({
            data: { email: email.toLowerCase().trim() }
        })

        const position = await prisma.waitlist.count()
        console.log(`[waitlist] New signup: ${email} (#${position})`)
        res.json({ message: 'Added to waitlist', position })
    } catch (err) {
        console.error('[waitlist]', err)
        res.status(500).json({ error: 'Failed to join waitlist' })
    }
})

// Admin endpoint to see all signups
router.get('/', async (_req: Request, res: Response) => {
    const list = await prisma.waitlist.findMany({
        orderBy: { createdAt: 'asc' },
        select: { email: true, createdAt: true }
    })
    res.json({ count: list.length, list })
})

export default router