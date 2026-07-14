import { cn } from '../../lib/utils'
import { formatBytes } from '../../lib/utils'

interface UsageBarProps { usedBytes: number; limitBytes: number; className?: string }

function getColor(pct: number): string {
  if (pct < 60) return '#34d399'
  if (pct < 85) return '#EF9F27'
  return '#E24B4A'
}

export function UsageBar({ usedBytes, limitBytes, className }: UsageBarProps) {
  const pct = limitBytes > 0 ? Math.min((usedBytes / limitBytes) * 100, 100) : 0
  const color = getColor(pct)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/40 font-body">Storage used</span>
        <span className="text-xs font-mono" style={{ color }}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-white/30 font-body">{formatBytes(usedBytes)} used</span>
        <span className="text-xs text-white/30 font-body">{formatBytes(limitBytes)} limit</span>
      </div>
    </div>
  )
}
