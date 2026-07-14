import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Logo } from '../shared/Logo'
import { LayoutDashboard, HardDrive, CreditCard, Key, Settings, Files } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/storage', icon: HardDrive, label: 'Storage' },
  { to: '/dashboard/payment', icon: CreditCard, label: 'Add Funds' },
  { to: '/dashboard/credentials', icon: Key, label: 'Credentials' },
  { to: '/dashboard/files', icon: Files, label: 'Files' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { user } = useAuthStore()
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-56 flex flex-col z-40 border-r border-white/[0.06]"
      style={{ background: 'rgba(9,15,13,0.95)' }}
    >
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 ease-out-expo',
              isActive
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-white/45 hover:text-white/85 hover:bg-white/5'
            )}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      {user?.email && (
        <div className="border-t border-white/5 px-5 py-4">
          <p className="truncate text-xs text-white/40" title={user.email}>{user.email}</p>
        </div>
      )}
    </aside>
  )
}
