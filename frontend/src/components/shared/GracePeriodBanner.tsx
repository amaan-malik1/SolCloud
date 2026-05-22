import { AlertTriangle, Clock, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SuspensionStatus } from '../../hooks/useDashboard'

function TimeRemaining({ expiresAt }: { expiresAt: string }) {
  const ms = new Date(expiresAt).getTime() - Date.now()
  if (ms <= 0) return <span>expired</span>
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return <span className="font-medium text-amber-300">{hours}h {minutes}m remaining</span>
}

export function GracePeriodBanner({ status }: { status: SuspensionStatus }) {
  if (status.inGracePeriod && status.graceExpiresAt) {
    return (
      <div className="p-4 rounded-xl flex items-start justify-between gap-4" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-300 mb-0.5">Low balance warning</p>
            <p className="text-xs text-white/45 font-body leading-relaxed">Your balance is empty. Storage will suspend in <TimeRemaining expiresAt={status.graceExpiresAt} />. Top up now to avoid interruption.</p>
          </div>
        </div>
        <Link to="/dashboard/payment" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 border border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-400/5 transition-all whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5" /> Add funds
        </Link>
      </div>
    )
  }

  if (status.status === 'SUSPENDED') {
    return (
      <div className="p-4 rounded-xl flex items-start justify-between gap-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400 mb-0.5">Storage suspended</p>
            <p className="text-xs text-white/45 font-body leading-relaxed">Your R2 credentials have been revoked. Send SOL to automatically reactivate your bucket within seconds.</p>
          </div>
        </div>
        <Link to="/dashboard/payment" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-all whitespace-nowrap">
          <CreditCard className="w-3.5 h-3.5" /> Reactivate
        </Link>
      </div>
    )
  }

  return null
}
