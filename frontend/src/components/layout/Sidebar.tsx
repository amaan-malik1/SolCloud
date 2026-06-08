import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Logo } from '../shared/Logo'
import { LayoutDashboard, HardDrive, CreditCard, Key, Settings, ExternalLink, BadgeCheck } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/storage', icon: HardDrive, label: 'Storage' },
  { to: '/dashboard/payment', icon: CreditCard, label: 'Add Funds' },
  { to: '/dashboard/credentials', icon: Key, label: 'Credentials' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { user } = useAuthStore();
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
      <div className=' absolute text-sm flex justify-center items-center gap-1'>
        <span className='fixed bottom-5 left-2'> {user?.email}</span>
      </div>
    </aside>
  )
}
