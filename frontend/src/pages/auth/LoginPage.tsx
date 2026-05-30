import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { FormField } from '../../components/shared/FormField'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const validate = () => {
    const e: Record<string, string> = {}

    if (!email) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email'
    }

    if (!password) {
      e.password = 'Password is required'
    }

    return e
  }

  const handleBlur = (field: string) => {
    setTouched((p) => ({
      ...p,
      [field]: true,
    }))

    setErrors(validate())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      email: true,
      password: true,
    })

    const errs = validate()

    setErrors(errs)

    if (Object.keys(errs).length > 0) return

    await login(email, password)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your storage and credentials"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Create one free"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <FormField
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">
              Password
            </span>

            <Link
              to="/forgot-password"
              className="text-xs text-white/40 transition-colors duration-200 hover:text-sol-purple"
            >
              Forgot password?
            </Link>
          </div>

          <FormField
            label=""
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sol-purple to-[#7233cc] py-3 text-sm font-medium text-white glow-purple transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              Logging in...
            </>
          ) : (
            'Log in →'
          )}
        </button>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5" />

          <span className="font-body text-xs text-white/25">
            or
          </span>

          <div className="h-px flex-1 bg-white/5" />
        </div>

        <Link
          to="/register"
          className="w-full rounded-xl border border-white/8 py-3 text-center font-body text-sm text-white/50 transition-all duration-200 hover:border-white/15 hover:text-white/70"
        >
          Create a new account
        </Link>
      </form>
    </AuthLayout>
  )
}