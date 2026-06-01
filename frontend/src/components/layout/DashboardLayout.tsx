import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export function DashboardLayout() {
  const { clearAuth } = useAuthStore();

  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen">
        <div className="h-16 sticky top-0 z-30 flex items-center justify-between px-8"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-white/25 font-mono">Your personal cloud object storage</p>
          <button
            onClick={clearAuth}
            className='flex justify-center items-center gap-2 rounded-full p-2 text-zinc-500 hover:border-b-2 border-slate-400 transition-colors hover:text-white '
          >
            Logout
            <LogOut className='h-4 w-4' />
          </button>
        </div>
        <div className="p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
