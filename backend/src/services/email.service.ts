import { Resend } from 'resend'
import { config } from '../config'

const resend = config.email.resendApiKey
  ? new Resend(config.email.resendApiKey)
  : null

// Frontend URL for links that open in browser
const FRONTEND = config.app.frontendUrl
// Backend URL for verification (backend handles token then redirects)
const BACKEND = process.env.BACKEND_URL || 'https://solstore-backend.onrender.com'
const FROM = config.email.from || 'onboarding@resend.dev'

async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.warn(`[email] Resend not configured — skipping "${subject}" to ${to}`)
    return
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) {
      console.error('[email] Resend error:', error)
      throw new Error(error.message)
    }
    console.log(`[email] ✅ Sent "${subject}" to ${to} — id: ${data?.id}`)
  } catch (err: any) {
    console.error(`[email] ❌ Failed "${subject}" to ${to}:`, err.message)
    throw err
  }
}

function template(body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SolStore</title>
</head>
<body style="margin:0;padding:40px 16px;background:#050507;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;">

    <!-- Card -->
    <div style="background:#0f0f13;border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden;">

      <!-- Top accent line -->
      <div style="height:3px;background:linear-gradient(90deg,#A855F7,#7C3AED,#5B21B6);"></div>

      <!-- Header -->
      <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <<div style="
width:36px;
height:36px;
border-radius:10px;
background:#ffffff;
display:flex;
align-items:center;
justify-content:center;
color:#000;
font-weight:900;
font-size:16px;
flex-shrink:0;
">
S
</div>
          <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">SolStore</span>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:36px 32px;">
        ${body}
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
        <p style="margin:0;color:rgba(255,255,255,0.2);font-size:12px;line-height:1.6;">
          Cloud storage built for developers<br/>
          <a href="${FRONTEND}" style="color:#A855F7;text-decoration:none;">solstore.pro</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`
}

// ── Verification email ─────────────────────────────────────────────────────
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  // Points to backend — backend verifies token then redirects to frontend
  const url = `${BACKEND}/api/auth/verify-email?token=${token}`

  await sendMail(email, 'Verify your SolStore email', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fafafa;margin:0 0 12px;letter-spacing:-0.5px;">
      Verify your email
    </h1>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 28px;">
      Click the button below to verify your email address and activate your SolStore account.
      This link expires in <strong style="color:#fafafa;">24 hours</strong>.
    </p>

    <a href="${url}"
      style="display:inline-block;padding:13px 28px;background:linear-gradient(
135deg,
#A855F7 0%,
#7C3AED 50%,
#5B21B6 100%
);box-shadow:0 8px 24px rgba(124,58,237,0.35);color:#fafafa;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:24px;">
      Verify email →
    </a>

    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0 0 8px;">
      Or paste this link in your browser:
    </p>
    <p style="font-size:11px;color:#A855F7;word-break:break-all;margin:0 0 20px;">
      ${url}
    </p>

    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
      If you didn't create a SolStore account, you can safely ignore this email.
    </p>
  `))
}

// ── Password reset email ───────────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  // Points to frontend — frontend has the reset password page
  const url = `${FRONTEND}/reset-password?token=${token}`

  await sendMail(email, 'Reset your SolStore password', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fafafa;margin:0 0 12px;letter-spacing:-0.5px;">
      Reset your password
    </h1>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 28px;">
      Someone requested a password reset for your SolStore account.
      This link expires in <strong style="color:#fafafa;">1 hour</strong>.
    </p>

    <a href="${url}"
      style="display:inline-block;padding:13px 28px;background:linear-gradient(
135deg,
#A855F7 0%,
#7C3AED 50%,
#5B21B6 100%
);color:#fafafa;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:24px;">
      Reset password →
    </a>

    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
      If you didn't request this, ignore this email. Your password won't change.
    </p>
  `))
}

// ── Welcome email (after verification) ────────────────────────────────────
export async function sendWelcomeEmail(email: string): Promise<void> {
  await sendMail(email, 'Welcome to SolStore 🎉', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fafafa;margin:0 0 12px;letter-spacing:-0.5px;">
      You're verified! 🎉
    </h1>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 20px;">
      Your email is confirmed. Connect your Solana wallet and send SOL to get your
      dedicated Cloudflare R2 bucket provisioned in under 60 seconds.
    </p>

    <div style="background:rgba(168,85,247,0.06);
border:1px solid rgba(168,85,247,0.18);
backdrop-filter:blur(10px);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);">What you get:</p>
      <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.62);">✓ 10 GB free storage</p>
      <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.62);">✓ $0.00 egress fees</p>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.62);">✓ S3-compatible API (AWS SDK, boto3, CLI)</p>
    </div>

    <a href="${FRONTEND}/dashboard/payment"
      style="display:inline-block;padding:13px 28px;background:linear-gradient(
135deg,
#A855F7 0%,
#7C3AED 50%,
#5B21B6 100%
);color:#fafafa;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">
      Add funds →
    </a>
  `))
}

// ── Provision failure email ────────────────────────────────────────────────
export async function sendProvisionFailureEmail(email: string): Promise<void> {
  await sendMail(email, 'Action needed — storage setup issue', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fafafa;margin:0 0 12px;letter-spacing:-0.5px;">
      Storage setup needs attention
    </h1>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 20px;">
      Your payment was received and your balance is safe — but we hit a temporary issue
      provisioning your R2 bucket.
    </p>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 28px;">
      To fix this, log in and send a small top-up (0.01 SOL minimum) to trigger a fresh
      provisioning attempt. This usually resolves immediately.
    </p>

    <a href="${FRONTEND}/dashboard/payment"
      style="display:inline-block;padding:13px 28px;background:linear-gradient(
135deg,
#A855F7 0%,
#7C3AED 50%,
#5B21B6 100%
);color:#fafafa;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:20px;">
      Go to dashboard →
    </a>

    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
      If this keeps happening, reply to this email and we'll fix it manually within 24 hours.
    </p>
  `))
}

// send subscription
export async function sendSubscriptionDowngradedEmail(
  email: string,
  previousTierName: string
): Promise<void> {
  await sendMail(email, 'Your SolStore subscription has changed', template(`
    <h1 style="font-size:24px;font-weight:700;color:#fafafa;margin:0 0 12px;letter-spacing:-0.5px;">
      Subscription renewal didn't go through
    </h1>

    <p style="font-size:14px;color:rgba(255,255,255,0.62);line-height:1.75;margin:0 0 20px;">
      Your <strong style="color:#fafafa;">${previousTierName}</strong> plan renewal was due,
      but your balance wasn't enough to cover it. You've been moved to the
      <strong style="color:#fafafa;">Free</strong> plan automatically.
    </p>

    <div style="background:rgba(249,115,22,0.06);border:1px solid rgba(249,115,22,0.18);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
        Don't worry — your bucket and data are safe. You're now on
        pay-as-you-go billing for usage beyond 10 GB. Top up your balance
        anytime to upgrade back to ${previousTierName}.
      </p>
    </div>

    <a href="${FRONTEND}/dashboard/settings"
      style="display:inline-block;padding:13px 28px;background:linear-gradient(
135deg,
#A855F7 0%,
#7C3AED 50%,
#5B21B6 100%
);color:#fafafa;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">
      Manage subscription →
    </a>
  `))
}