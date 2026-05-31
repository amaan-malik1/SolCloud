import nodemailer from "nodemailer"
import { config } from "../config"

const FRONTEND_BASE = config.app.frontendUrl;
const BACKEND_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

function createTransporter() {
  if (!config.email.host || !config.email.user || !config.email.pass) {
    console.warn('[email] SMTP not configured — email disabled')
    return null
  }

  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },

    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })
}
const transporter = createTransporter()


//shared email
async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!transporter) {
    console.warn(`[email] Skipped — SMTP not configured. Would send "${subject}" to ${to}`)
    return
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    })
    console.log(`[email] Sent "${subject}" to ${to} — messageId: ${info.messageId}`)
  } catch (err: any) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err.message)
    throw err  // Re-throw so caller knows
  }
}

//email template
function template(body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>SolStore</title>
</head>

<body style="
  margin:0;
  padding:40px 16px;
  background:#09090b;
  font-family:Inter,Arial,sans-serif;
">

  <div style="
    max-width:620px;
    margin:0 auto;
    position:relative;
  ">

    <!-- Ambient Glow -->
    <div style="
      position:absolute;
      inset:0;
      background:
      radial-gradient(circle at top,
      rgba(249,115,22,0.12),
      transparent 65%);
      pointer-events:none;
    "></div>

    <!-- Card -->
    <div style="
      position:relative;
      overflow:hidden;
      border-radius:28px;
      border:1px solid rgba(255,255,255,0.08);
      background:#111114;
    ">

      <!-- Accent Line -->
      <div style="
        height:3px;
        background:
        linear-gradient(
          90deg,
          #f97316,
          #f59e0b,
          #f97316
        );
      "></div>

      <!-- Texture -->
      <div style="
        position:absolute;
        inset:0;
        opacity:.03;
        background-image:
          linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
        background-size:24px 24px;
      "></div>

      <!-- Header -->
      <div style="
        padding:32px;
        border-bottom:1px solid rgba(255,255,255,0.06);
      ">

        <div style="
          display:flex;
          align-items:center;
          gap:14px;
        ">

          <div style="
            width:46px;
            height:46px;
            border-radius:14px;
            background:
            linear-gradient(
              135deg,
              #f97316,
              #f59e0b
            );
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-size:18px;
            font-weight:800;
          ">
            S
          </div>

          <div>
            <div style="
              color:white;
              font-size:30px;
              font-weight:800;
              letter-spacing:-1px;
              line-height:1.1;
              font-weight:800;
              letter-spacing:-0.5px;
            ">
              SolStore
            </div>

            <div style="
              color:rgba(255,255,255,.35);
              font-size:12px;
            ">
              Cloud Storage Powered by Solana
            </div>
          </div>

        </div>
      </div>

      <!-- Body -->
      <div style="
        padding:40px 32px;
        position:relative;
        z-index:2;
      ">
        ${body}
      </div>

      <!-- Footer -->
      <div style="
        padding:24px 32px;
        border-top:1px solid rgba(255,255,255,.06);
      ">
        <p style="
          margin:0;
          color:rgba(255,255,255,.25);
          text-align:center;
          font-size:12px;
          line-height:1.8;
        ">
          Permissionless Cloud Storage • Cloudflare R2 • Solana Payments
        </p>
      </div>

    </div>
  </div>

</body>
</html>
`
}

//verification email
export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${BACKEND_BASE}/api/auth/verify-email?token=${token}`

  await sendMail(
    email,
    'Verify your SolStore email',
    template(`
      <h1 style="font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1.1;color:#fff;margin:0 0 12px;">
        Verify your email
      </h1>

      <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 28px;">
        Click the button below to verify your email address and activate your SolStore account.
        This link expires in <strong style="color:#fff;">24 hours</strong>.
      </p>

      <a href="${url}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#f97316,#f59e0b);box-shadow:0 10px 30px rgba(249,115,22,.25);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:24px;">
        Verify email →
      </a>

      <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
        Or paste this link in your browser:
        <br />
        <span style="color:rgba(249,115,22,0.8);word-break:break-all;">
          ${url}
        </span>
      </p>

      <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:20px 0 0;">
        If you didn't create a SolStore account, you can safely ignore this email.
      </p>
    `),
  )
}

//send reset email
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const url = `${FRONTEND_BASE}/reset-password?token=${token}`

  await sendMail(email, 'Reset your SolStore password', template(`
    <h1 style="font-size:30px;
font-weight:800;
letter-spacing:-1px;
line-height:1.1;font-weight:700;color:#fff;margin:0 0 12px;letter-spacing:-0.5px;">
      Reset your password
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 28px;">
      Someone requested a password reset for your SolStore account.
      This link expires in <strong style="color:#fff;">1 hour</strong>.
    </p>
    <a href="${url}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#f97316,#f59e0b);box-shadow:0 10px 30px rgba(249,115,22,.25);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;margin-bottom:24px;">
      Reset password →
    </a>
    <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0;">
      If you didn't request this, ignore this email. Your password won't change.
    </p>
  `))
}

//resend verification
export async function sendWelcomeEmail(email: string): Promise<void> {
  await sendMail(email, 'Welcome to SolStore 🎉', template(`
    <h1 style="font-size:30px;
      font-weight:800;
      letter-spacing:-1px;
      line-height:1.1;font-weight:700;color:#fff;margin:0 0 12px;letter-spacing:-0.5px;">
      You're verified! Welcome to SolStore.
    </h1>
    <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 20px;">
      Your email is confirmed. Connect your Solana wallet and send SOL to get your Cloudflare R2 bucket provisioned in under 60 seconds.
    </p>
    <a href="${FRONTEND_BASE}/dashboard/payment" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#f97316,#f59e0b);background:linear-gradient(135deg,#f97316,#f59e0b);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:15px;">
      Add funds →
    </a>
  `))
}
