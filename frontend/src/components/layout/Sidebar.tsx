import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Logo } from '../shared/Logo'
import { LayoutDashboard, HardDrive, CreditCard, Key, Settings, ExternalLink } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/storage', icon: HardDrive, label: 'Storage' },
  { to: '/dashboard/payment', icon: CreditCard, label: 'Add Funds' },
  { to: '/dashboard/credentials', icon: Key, label: 'Credentials' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 flex flex-col z-40"
      style={{ background: 'rgba(10,10,16,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-16 flex items-center px-5 border-b border-white/5">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all duration-150',
              isActive ? 'bg-sol-purple/10 text-sol-purple border border-sol-purple/20' : 'text-white/45 hover:text-white/80 hover:bg-white/5'
            )}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <a href="https://earn.superteam.fun" target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/30 hover:text-white/50 transition-colors">
          <ExternalLink className="w-3 h-3" />Superteam Grant
        </a>
      </div>
    </aside>
  )
}
