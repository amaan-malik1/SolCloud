import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { authApi } from '@/api/auth.api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuthStore } from '@/store/auth.store'

export default function VerifyEmailPage() {
    const [params] = useSearchParams()
    const status = params.get('status')
    const email = params.get('email')
    const { setEmailVerified } = useAuthStore()
    const [resending, setResending] = useState(false)
    const [resent, setResent] = useState(false)

    useEffect(() => {
        if (status === 'success') {
            setEmailVerified(true)
        }
    }, [status])

    const handleResend = async () => {
        if (!email) return
        setResending(true)
        try {
            await authApi.resendVerification(email)
            setResent(true)
        } catch { /* nothing */ }
        finally { setResending(false) }
    }

    if (status === 'success') {
        return (
            <Page>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <CheckCircle size={32} color="#14F195" />
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px' }}>
                        Email verified!
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
                        Your account is now active.{email && <><br />Signed in as <strong style={{ color: '#fff' }}>{email}</strong></>}
                    </p>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#9945FF,#7233cc)', color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 24px rgba(153,69,255,0.35)' }}>
                        Go to dashboard →
                    </Link>
                </div>
            </Page>
        )
    }

    if (status === 'expired') {
        return (
            <Page>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <XCircle size={32} color="#f87171" />
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#fff', marginBottom: 12 }}>
                        Link expired
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
                        This verification link has expired or already been used.<br />
                        Request a new one below.
                    </p>
                    {resent ? (
                        <p style={{ fontSize: 14, color: '#14F195', fontFamily: 'DM Sans, sans-serif' }}>✓ New verification email sent — check your inbox</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                            {email && (
                                <button onClick={handleResend} disabled={resending}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#9945FF,#7233cc)', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                                    {resending ? <><LoadingSpinner className="w-4 h-4" />Sending...</> : <><RefreshCw size={16} />Resend verification</>}
                                </button>
                            )}
                            <Link to="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>Back to login</Link>
                        </div>
                    )}
                </div>
            </Page>
        )
    }

    // No status — user landed directly, show check-your-email
    return (
        <Page>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Mail size={32} color="#9945FF" />
                </div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#fff', marginBottom: 12 }}>
                    Check your email
                </h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32, fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>
                    We sent a verification link to your email.<br />
                    Click it to activate your account. Expires in 24 hours.
                </p>
                <Link to="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>Back to login</Link>
            </div>
        </Page>
    )
}

function Page({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(153,69,255,0.1), transparent 70%)', pointerEvents: 'none' }} />
            <Link to="/" style={{ marginBottom: 40 }}><Logo size="md" /></Link>
            <div style={{ width: '100%', maxWidth: 440, padding: '40px 36px', borderRadius: 20, background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {children}
            </div>
        </div>
    )
}