import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export function DashboardLayout() {
  const { clearAuth } = useAuthStore()

  return (
    <div className="min-h-[100dvh] bg-dark-bg grid-bg flex">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-[100dvh]">
        <div
          className="h-16 sticky top-0 z-30 flex items-center justify-between border-b border-white/5 px-8"
          style={{ background: 'rgba(6,10,9,0.85)', backdropFilter: 'blur(20px)' }}
        >
          <p className="text-xs text-white/30 font-mono">Your personal cloud object storage</p>
          <button
            onClick={clearAuth}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-white/60 transition-all duration-300 hover:border-white/25 hover:text-white"
          >
            Log out
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
