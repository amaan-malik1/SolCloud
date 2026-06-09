import { Resend } from 'resend'
import { config } from '../config'

const resend = config.email.resendApiKey
  ? new Resend(config.email.resendApiKey)
  : null

const BASE = config.app.frontendUrl
const FROM = config.email.from || 'onboarding@resend.dev'

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.warn(`[email] Resend not configured — skipping "${subject}" to ${to}`)
    return
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) { console.error('[email] Resend error:', error); throw new Error(error.message) }
    console.log(`[email] Sent "${subject}" to ${to} — id: ${data?.id}`)
  } catch (err: any) {
    console.error(`[email] Failed "${subject}" to ${to}:`, err.message)
    throw err
  }
}

function template(body: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:40px 16px;background:#09090b;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#111114;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#9945FF,#14F195);"></div>
    <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#9945FF,#14F195);display:flex;align-items:center;justify-content:center;color:#000;font-weight:900;font-size:16px;">S</div>
      <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">SolStore</span>
    </div>
    <div style="padding:36px 32px;">${body}</div>
    <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;">Permissionless cloud storage on Solana · Built in India</p>
    </div>
  </div></body></html>`
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const url = `${process.env.BACKEND_URL}/verify-email?token=${token}`;

  await sendMail(email, 'Verify your SolStore email', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 12px;letter-spacing:-0.5px;">Verify your email</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 28px;">
      Click below to activate your SolStore account. Expires in <strong style="color:#fff;">24 hours</strong>.
    </p>
    <a href="${url}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#9945FF,#7233cc);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:20px;">
      Verify email →
    </a>
    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:16px 0 0;">
      If you didn't create a SolStore account, ignore this email.
    </p>
  `))
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const url = `${BASE}/reset-password?token=${token}`
  await sendMail(email, 'Reset your SolStore password', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 12px;">Reset your password</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 28px;">
      This link expires in <strong style="color:#fff;">1 hour</strong>.
    </p>
    <a href="${url}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#9945FF,#7233cc);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">
      Reset password →
    </a>
    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:16px 0 0;">
      If you didn't request this, ignore this email.
    </p>
  `))
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  await sendMail(email, 'Welcome to SolStore 🎉', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 12px;">You're verified! 🎉</h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 24px;">
      Your email is confirmed. Connect your Solana wallet and send SOL to get your Cloudflare R2 bucket in under 60 seconds.
    </p>
    <a href="${BASE}/dashboard/payment" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#9945FF,#7233cc);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">
      Add funds →
    </a>
  `))
}