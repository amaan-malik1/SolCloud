import { type Request, type Response, type NextFunction } from 'express'
import { verifyToken } from '../services/auth.service'
import { prisma } from '../db/client'

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  const token = header.slice(7)

  try {
    const payload = verifyToken(token)

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { tokenVersion: true },
    })

    if (!user) {
      res.status(401).json({ error: 'User not found' })
      return
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({ error: 'Session expired, please log in again' })
      return
    }

    ; (req as any).user = payload
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}