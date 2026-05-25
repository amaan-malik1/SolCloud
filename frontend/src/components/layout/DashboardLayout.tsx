import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen">
        <div className="h-16 sticky top-0 z-30 flex items-center px-8"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-white/25 font-mono">Your personal cloud object storage</p>
        </div>
        <div className="p-8 max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
