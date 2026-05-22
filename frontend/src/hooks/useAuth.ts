import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  const register = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.register(email, password)
      setAuth(res.user, res.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Registration failed')
    } finally { setIsLoading(false) }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(email, password)
      setAuth(res.user, res.token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Login failed')
    } finally { setIsLoading(false) }
  }

  const logout = () => { clearAuth(); navigate('/'); toast.success('Logged out') }

  return { register, login, logout, isLoading, isAuthenticated, user }
}
