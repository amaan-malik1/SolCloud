import { Router, type Request, type Response } from 'express'
import {
  register, login, getMe,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword,
} from '../services/auth.service'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// ── POST /api/auth/register ────────────────────────────────────────────────
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

// ── POST /api/auth/login ───────────────────────────────────────────────────
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

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await getMe((req as any).user!.userId)
    res.json({ user })
  } catch {
    res.status(404).json({ error: 'User not found' })
  }
})

// ── GET /api/auth/verify-email?token=xxx ──────────────────────────────────
// User clicks this link from their email (browser navigation, not axios)
// Backend verifies token then redirects to frontend
router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query

  if (!token || typeof token !== 'string') {
    // Redirect to frontend error page instead of JSON
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
    return
  }

  try {
    const { email } = await verifyEmail(token)
    console.log(`[auth] ✅ Email verified for: ${email}`)
    // Redirect to frontend success page
    res.redirect(
      `${process.env.FRONTEND_URL}/verify-email?status=success&email=${encodeURIComponent(email)}`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'UNKNOWN'
    console.error('[auth/verify-email] Error:', msg)

    if (msg === 'INVALID_TOKEN') {
      res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
      return
    }

    // Any other error — redirect to expired page (safe fallback)
    res.redirect(`${process.env.FRONTEND_URL}/verify-email?status=expired`)
  }
})

// ── POST /api/auth/resend-verification ────────────────────────────────────
router.post('/resend-verification', async (req: Request, res: Response) => {
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

    // Don't 500 on email failure — still return success for security
    res.json({ success: true, message: 'Verification email sent if account exists' })
  }
})

// ── POST /api/auth/forgot-password ────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Email required' })
    return
  }

  try {
    await forgotPassword(email)
    // Always return same message — never reveal if email exists
    res.json({ message: 'Reset email sent if account exists' })
  } catch {
    res.json({ message: 'Reset email sent if account exists' })
  }
})

// ── POST /api/auth/reset-password ─────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body

  if (!token || !password) {
    res.status(400).json({ error: 'Token and password required' })
    return
  }

  try {
    await resetPassword(token, password)
    res.json({ message: 'Password reset successfully' })
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