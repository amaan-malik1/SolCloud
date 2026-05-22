import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { PageLoader } from './LoadingSpinner'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated === undefined) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
