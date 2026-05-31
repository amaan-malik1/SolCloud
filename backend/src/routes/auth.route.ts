import { Router, type Request, type Response } from 'express'
import {
  register, login, getMe,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword,
} from '../services/auth.service'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()


router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }
  try {
    const result = await register(email, password)
    res.status(201).json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'EMAIL_TAKEN') { res.status(409).json({ error: 'Email already in use' }); return }
    if (msg === 'PASSWORD_TOO_SHORT') { res.status(400).json({ error: 'Password must be at least 8 characters' }); return }
    console.error('[auth/register]', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }
  try {
    const result = await login(email, password)
    res.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'INVALID_CREDENTIALS') { res.status(401).json({ error: 'Invalid email or password' }); return }
    console.error('[auth/login]', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await getMe((req as any).user!.userId)
    res.json({ user })
  } catch {
    res.status(404).json({ error: 'User not found' })
  }
})

router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query
  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' })
    return
  }
  try {
    const { email } = await verifyEmail(token)
    // Redirect to frontend with success flag
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=success&email=${encodeURIComponent(email)}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'INVALID_TOKEN') {
      res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
      return
    }
    res.status(500).json({ error: 'Verification failed' })
  }
})

router.post('/resend-verification', async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Email required' })
    return
  }

  console.log('[auth] Resend verification requested for:', email)

  try {
    await resendVerification(email)
    res.json({ message: 'Verification email sent if account exists' })
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    console.error('[auth/resend-verification] Error:', msg)

    if (msg === 'ALREADY_VERIFIED') {
      res.status(400).json({ error: 'Email already verified' })
      return
    }

    // Don't 500 — email send failing shouldn't break the response
    res.json({ message: 'Verification email sent if account exists' })
  }
})

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) { res.status(400).json({ error: 'Email required' }); return }
  try {
    await forgotPassword(email)
    res.json({ message: 'Reset email sent if account exists' })
  } catch {
    res.json({ message: 'Reset email sent if account exists' })
  }
})

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body
  if (!token || !password) { res.status(400).json({ error: 'Token and password required' }); return }
  try {
    await resetPassword(token, password)
    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'INVALID_TOKEN') { res.status(400).json({ error: 'Invalid or expired reset link' }); return }
    if (msg === 'PASSWORD_TOO_SHORT') { res.status(400).json({ error: 'Password must be at least 8 characters' }); return }
    res.status(500).json({ error: 'Reset failed' })
  }
})

export default router