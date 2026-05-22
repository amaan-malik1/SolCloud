import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SolanaWalletProvider } from './context/WalletProvider'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import StoragePage from './pages/dashboard/StoragePage'
import PaymentPage from './pages/dashboard/PaymentPage'
import CredentialsPage from './pages/dashboard/CredentialsPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <SolanaWalletProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/storage" element={<StoragePage />} />
                <Route path="/dashboard/payment" element={<PaymentPage />} />
                <Route path="/dashboard/credentials" element={<CredentialsPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#13131f',
              color: '#f0f0f8',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </QueryClientProvider>
    </SolanaWalletProvider>
  )
}
