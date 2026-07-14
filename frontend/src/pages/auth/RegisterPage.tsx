import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { FormField } from '../../components/shared/FormField'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
  const score = checks.filter(Boolean).length
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-sol-green']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-white/10'}`} />)}
      </div>
      <span className="text-xs text-white/40 font-body w-12">{labels[score]}</span>
    </div>
  )
}

export default function RegisterPage() {
  const { register, isLoading, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const e: Record<string, string> = {}
    if (!email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'At least 8 characters'
    else if (!/[A-Z]/.test(password)) e.password = 'Include at least one uppercase letter'
    else if (!/[0-9]/.test(password)) e.password = 'Include at least one number'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (confirm !== password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleBlur = (field: string) => { setTouched(p => ({ ...p, [field]: true })); setErrors(validate()) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true, confirm: true })
    const errs = validate(); setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await register(email, password)
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start storing files on Solana — no credit card needed"
      footerText="Already have an account?" footerLink="/login" footerLinkText="Log in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField label="Email" id="email" type="email" value={email} onChange={setEmail}
          onBlur={() => handleBlur('email')} error={touched.email ? errors.email : undefined} placeholder="you@example.com" autoComplete="email" />
        <div className="flex flex-col gap-1.5">
          <FormField label="Password" id="password" type="password" value={password} onChange={setPassword}
            onBlur={() => handleBlur('password')} error={touched.password ? errors.password : undefined} placeholder="Min 8 characters" autoComplete="new-password" />
          <PasswordStrength password={password} />
        </div>
        <FormField label="Confirm password" id="confirm" type="password" value={confirm} onChange={setConfirm}
          onBlur={() => handleBlur('confirm')} error={touched.confirm ? errors.confirm : undefined} placeholder="Repeat your password" autoComplete="new-password" />
        <button type="submit" disabled={isLoading}
          className="w-full py-3 rounded-xl font-medium text-sm text-accent-ink bg-accent glow-purple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isLoading ? <><LoadingSpinner className="w-4 h-4" />Creating account...</> : 'Create account →'}
        </button>
        <Link to="/login" className="w-full py-3 rounded-xl text-sm text-white/50 text-center border border-white/8 hover:border-white/15 hover:text-white/70 transition-all font-body">
          Log in to existing account
        </Link>
      </form>
    </AuthLayout>
  )
}
