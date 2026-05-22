import { cn } from '../../lib/utils'
import { LoadingSpinner } from './LoadingSpinner'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps { label: string; value: string; sub?: string; icon: LucideIcon; isLoading?: boolean; accent?: 'purple' | 'green' | 'blue' | 'default'; onClick?: () => void }

const accents = {
  purple: { icon: 'text-sol-purple', iconBg: 'bg-sol-purple/10 border-sol-purple/20', glow: 'hover:border-sol-purple/25' },
  green: { icon: 'text-sol-green', iconBg: 'bg-sol-green/10 border-sol-green/20', glow: 'hover:border-sol-green/25' },
  blue: { icon: 'text-sol-blue', iconBg: 'bg-sol-blue/10 border-sol-blue/20', glow: 'hover:border-sol-blue/25' },
  default: { icon: 'text-white/50', iconBg: 'bg-white/5 border-white/10', glow: 'hover:border-white/15' },
}

export function StatCard({ label, value, sub, icon: Icon, isLoading, accent = 'default', onClick }: StatCardProps) {
  const s = accents[accent]
  return (
    <div onClick={onClick} className={cn('p-6 rounded-2xl transition-all duration-200 border border-white/7 surface-card', s.glow, onClick && 'cursor-pointer')}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', s.iconBg)}>
          <Icon className={cn('w-5 h-5', s.icon)} />
        </div>
        {isLoading && <LoadingSpinner className="w-4 h-4" />}
      </div>
      <p className="text-xs text-white/40 font-body mb-1 uppercase tracking-wider">{label}</p>
      <p className="font-display font-bold text-2xl text-white tracking-tight">{isLoading ? '—' : value}</p>
      {sub && <p className="text-xs text-white/30 font-body mt-1">{sub}</p>}
    </div>
  )
}
