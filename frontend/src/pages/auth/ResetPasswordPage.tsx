import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Lock, CheckCircle } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Logo } from '@/components/shared/Logo'

export default function ResetPasswordPage() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const token = params.get('token') ?? ''
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 8) { setError('At least 8 characters'); return }
        if (password !== confirm) { setError('Passwords do not match'); return }
        setLoading(true)
        try {
            await authApi.resetPassword(token, password)
            setDone(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err: any) {
            setError(err?.response?.data?.error ?? 'Reset failed')
        } finally { setLoading(false) }
    }

    if (!token) return (
        <Wrap>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Geist Variable", system-ui, sans-serif', textAlign: 'center' }}>
                Invalid reset link. <Link to="/forgot-password" style={{ color: '#34d399' }}>Request a new one.</Link>
            </p>
        </Wrap>
    )

    if (done) return (
        <Wrap>
            <div style={{ textAlign: 'center' }}>
                <CheckCircle size={40} color="#34d399" style={{ margin: '0 auto 20px' }} />
                <h1 style={{ fontFamily: '"Geist Variable", system-ui, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 12 }}>Password reset!</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: '"Geist Variable", system-ui, sans-serif' }}>Redirecting to login in 3 seconds...</p>
            </div>
        </Wrap>
    )

    return (
        <Wrap>
            <h1 style={{ fontFamily: '"Geist Variable", system-ui, sans-serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 8 }}>Set new password</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontFamily: '"Geist Variable", system-ui, sans-serif' }}>Choose a strong password — minimum 8 characters.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                    { label: 'New password', val: password, set: setPassword, ph: 'Min 8 characters', ac: 'new-password' },
                    { label: 'Confirm password', val: confirm, set: setConfirm, ph: 'Repeat password', ac: 'new-password' },
                ].map(f => (
                    <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', fontFamily: '"Geist Variable", system-ui, sans-serif' }}>{f.label}</label>
                        <input type="password" value={f.val} onChange={e => { f.set(e.target.value); setError('') }}
                            placeholder={f.ph} autoComplete={f.ac}
                            style={{ padding: '11px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', fontFamily: '"Geist Variable", system-ui, sans-serif' }} />
                    </div>
                ))}

                {error && <p style={{ fontSize: 12, color: '#f87171', fontFamily: '"Geist Variable", system-ui, sans-serif' }}>⚠ {error}</p>}

                <button type="submit" disabled={loading}
                    style={{ padding: '13px', borderRadius: 12, background: '#34d399', color: '#052e21', fontWeight: 600, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: '"Geist Variable", system-ui, sans-serif', marginTop: 4 }}>
                    {loading ? <><LoadingSpinner className="w-4 h-4" />Resetting...</> : <><Lock size={16} />Reset password</>}
                </button>
            </form>
        </Wrap>
    )
}

function Wrap({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#060a09', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Link to="/" style={{ marginBottom: 40 }}><Logo size="md" /></Link>
            <div style={{ width: '100%', maxWidth: 440, padding: '40px 36px', borderRadius: 20, background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {children}
            </div>
        </div>
    )
}