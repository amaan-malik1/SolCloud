import { cn } from '../../lib/utils'

interface FormFieldProps {
  label: string; id: string; type?: string; value: string
  onChange: (v: string) => void; onBlur?: () => void
  error?: string; placeholder?: string; autoComplete?: string; hint?: string
}

export function FormField({ label, id, type = 'text', value, onChange, onBlur, error, placeholder, autoComplete, hint }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white/70 font-body">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder} autoComplete={autoComplete}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl text-sm font-body text-white',
          'placeholder:text-white/25 outline-none transition-all duration-200',
          'bg-white/5 border',
          error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-sol-purple/60',
          'focus:ring-2 focus:ring-sol-purple/10'
        )}
      />
      {error && <p className="text-xs text-red-400 font-body">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-white/30 font-body">{hint}</p>}
    </div>
  )
}
