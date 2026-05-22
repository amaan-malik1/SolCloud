import { cn } from '../../lib/utils'

interface SettingsSectionProps { title: string; description?: string; children: React.ReactNode; danger?: boolean; className?: string }

export function SettingsSection({ title, description, children, danger = false, className }: SettingsSectionProps) {
  return (
    <div className={cn('p-6 rounded-2xl', className)} style={{ background: 'rgba(19,19,31,0.9)', border: danger ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-5">
        <h2 className={cn('font-display font-semibold text-base mb-1', danger ? 'text-red-400' : 'text-white')}>{title}</h2>
        {description && <p className="text-xs text-white/35 font-body leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  )
}
