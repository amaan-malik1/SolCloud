import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { authApi } from '@/api/auth.api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) { setError('Email is required'); return }
        setLoading(true)
        try {
            await authApi.forgotPassword(email)
            setSent(true)
        } catch { setSent(true) } // Always show success — security
        finally { setLoading(false) }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(153,69,255,0.1), transparent 70%)', pointerEvents: 'none' }} />
            <Link to="/" style={{ marginBottom: 40 }}><Logo size="md" /></Link>

            <div style={{ width: '100%', maxWidth: 440, padding: '40px 36px', borderRadius: 20, background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 1 }}>
                {sent ? (
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={40} color="#14F195" style={{ margin: '0 auto 20px' }} />
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 12 }}>Check your email</h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>
                            If an account exists for <strong style={{ color: '#fff' }}>{email}</strong>, we've sent a password reset link. It expires in 1 hour.
                        </p>
                        <Link to="/login" style={{ fontSize: 14, color: '#9945FF', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>Back to login</Link>
                    </div>
                ) : (
                    <>
                        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>
                            <ArrowLeft size={14} /> Back to login
                        </Link>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 8 }}>Forgot password?</h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontFamily: 'DM Sans, sans-serif' }}>Enter your email and we'll send a reset link.</p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Email</label>
                                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                                    placeholder="you@example.com" autoComplete="email"
                                    style={{ padding: '11px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
                                {error && <p style={{ fontSize: 12, color: '#f87171' }}>⚠ {error}</p>}
                            </div>

                            <button type="submit" disabled={loading}
                                style={{ padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg,#9945FF,#7233cc)', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'DM Sans, sans-serif' }}>
                                {loading ? <><LoadingSpinner className="w-4 h-4" />Sending...</> : <><Mail size={16} />Send reset link</>}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}