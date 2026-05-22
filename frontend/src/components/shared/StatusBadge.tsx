import { cn } from '../../lib/utils'

type Status = 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'PENDING'

const styles: Record<Status, { dot: string; text: string; bg: string; border: string }> = {
  ACTIVE: { dot: 'bg-sol-green', text: 'text-sol-green', bg: 'bg-sol-green/10', border: 'border-sol-green/20' },
  SUSPENDED: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  DELETED: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  PENDING: { dot: 'bg-white/40', text: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' },
}

export function StatusBadge({ status, pulse = false }: { status: string; pulse?: boolean }) {
  const s = styles[status as Status] ?? styles.PENDING
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-body', s.text, s.bg, s.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', s.dot, pulse && status === 'ACTIVE' && 'animate-pulse')} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
