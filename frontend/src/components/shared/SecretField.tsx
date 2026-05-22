import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface SecretFieldProps { label: string; value: string; isSecret?: boolean; mono?: boolean; className?: string }

export function SecretField({ label, value, isSecret = true, mono = true, className }: SecretFieldProps) {
  const [visible, setVisible] = useState(!isSecret)
  const [copied, setCopied] = useState(false)
  const displayValue = visible ? value : '•'.repeat(Math.min(value.length, 32))
  const handleCopy = async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs text-white/40 font-body uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span className={cn('flex-1 text-sm text-white min-w-0 truncate select-all', mono && 'font-mono text-xs', !visible && 'tracking-widest text-white/40')}>{displayValue}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isSecret && (
            <button onClick={() => setVisible(!visible)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
              {visible ? <EyeOff className="w-3.5 h-3.5 text-white/30 hover:text-white/60" /> : <Eye className="w-3.5 h-3.5 text-white/30 hover:text-white/60" />}
            </button>
          )}
          <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-sol-green" /> : <Copy className="w-3.5 h-3.5 text-white/30 hover:text-white/60" />}
          </button>
        </div>
      </div>
    </div>
  )
}
