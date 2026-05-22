import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DetailRowProps { label: string; value: string; mono?: boolean; copyable?: boolean; truncate?: boolean }

export function DetailRow({ label, value, mono = false, copyable = false, truncate = false }: DetailRowProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
      <span className="text-xs text-white/40 font-body flex-shrink-0 w-28">{label}</span>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={cn('text-sm text-white text-right', mono && 'font-mono text-xs', truncate && 'truncate max-w-[200px]')} title={truncate ? value : undefined}>{value}</span>
        {copyable && (
          <button onClick={handleCopy} className="flex-shrink-0 p-1 rounded hover:bg-white/5 transition-colors" title="Copy">
            {copied ? <Check className="w-3.5 h-3.5 text-sol-green" /> : <Copy className="w-3.5 h-3.5 text-white/30 hover:text-white/60" />}
          </button>
        )}
      </div>
    </div>
  )
}
