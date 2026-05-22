import { cn } from '../../lib/utils'

interface ToggleProps { checked: boolean; onChange: (val: boolean) => void; label: string; description?: string; disabled?: boolean }

export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return (
    <div className={cn('flex items-center justify-between py-3', disabled && 'opacity-50')}>
      <div>
        <p className="text-sm font-medium text-white font-body">{label}</p>
        {description && <p className="text-xs text-white/35 font-body mt-0.5">{description}</p>}
      </div>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onChange(!checked)}
        className={cn('relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200', checked ? 'bg-sol-purple' : 'bg-white/15', disabled && 'cursor-not-allowed')}>
        <span className={cn('pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200', checked ? 'translate-x-5' : 'translate-x-0')} />
      </button>
    </div>
  )
}
