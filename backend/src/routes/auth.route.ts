import { Router, type Request, type Response } from 'express'
import {
  register, login, getMe,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword,
  invalidateAllSessions,
} from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { authRateLimit, emailRateLimit, registerRateLimit } from '../middleware/rate.limit';
import { healSingleUser } from '../services/heal.service';

const router = Router();

//  POST /api/auth/register 
router.post('/register', registerRateLimit, async (req: Request, res: Response) => {
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

//  POST /api/auth/login 
router.post('/login', authRateLimit, async (req: Request, res: Response) => {
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

//  GET /api/auth/me 
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.userId
    const user = await getMe(userId)

    // Auto-heal: has balance but no bucket → re-queue provisioning.
    // Fire-and-forget — don't block the response on this.
    healSingleUser(userId).catch(() => { })

    res.json({ user })
  } catch {
    res.status(404).json({ error: 'User not found' })
  }
})

//  POST /api/auth/logout-all — invalidate all sessions 
router.post('/logout-all', authMiddleware, async (req: Request, res: Response) => {
  try {
    await invalidateAllSessions((req as any).user!.userId)
    res.json({ message: 'All sessions invalidated. Please log in again.' })
  } catch {
    res.status(500).json({ error: 'Failed to invalidate sessions' })
  }
})

//  GET /api/auth/verify-email?token=xxx 
router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query

  if (!token || typeof token !== 'string') {
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
    return
  }

  try {
    const { email } = await verifyEmail(token)
    console.log(`[auth] ✅ Email verified for: ${email}`)
    res.redirect(
      `${process.env.FRONTEND_URL}/verify-email?status=success&email=${encodeURIComponent(email)}`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    console.error('[auth/verify-email] Error:', msg)
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
  }
})

//  POST /api/auth/resend-verification 
router.post('/resend-verification', emailRateLimit, async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Email required' })
    return
  }

  console.log('[auth] Resend verification requested for:', email)

  try {
    await resendVerification(email)
    res.json({ success: true, message: 'Verification email sent if account exists' })
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    console.error('[auth/resend-verification] Error:', msg)

    if (msg === 'ALREADY_VERIFIED') {
      res.status(400).json({ error: 'Email already verified' })
      return
    }

    res.json({ success: true, message: 'Verification email sent if account exists' })
  }
})

//  POST /api/auth/forgot-password 
router.post('/forgot-password', emailRateLimit, async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Email required' })
    return
  }

  try {
    await forgotPassword(email)
    res.json({ message: 'Reset email sent if account exists' })
  } catch {
    res.json({ message: 'Reset email sent if account exists' })
  }
})

//  POST /api/auth/reset-password 
router.post('/reset-password', authRateLimit, async (req: Request, res: Response) => {
  const { token, password } = req.body

  if (!token || !password) {
    res.status(400).json({ error: 'Token and password required' })
    return
  }

  try {
    await resetPassword(token, password)
    res.json({ message: 'Password reset successfully. All sessions have been logged out for security.' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    if (msg === 'INVALID_TOKEN') {
      res.status(400).json({ error: 'Invalid or expired reset link' })
      return
    }
    if (msg === 'PASSWORD_TOO_SHORT') {
      res.status(400).json({ error: 'Password must be at least 8 characters' })
      return
    }
    console.error('[auth/reset-password]', err)
    res.status(500).json({ error: 'Reset failed' })
  }
})

export default router