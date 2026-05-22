import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CodeSnippet({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {['bg-red-500/40', 'bg-amber-500/40', 'bg-sol-green/40'].map((c, i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
          </div>
          {label && <span className="text-xs text-white/30 font-mono ml-2">{label}</span>}
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-body">
          {copied ? <><Check className="w-3 h-3 text-sol-green" /><span className="text-sol-green">Copied!</span></> : <><Copy className="w-3 h-3" />Copy</>}
        </button>
      </div>
      <div className="p-4 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <pre className="text-xs font-mono text-white/70 leading-relaxed whitespace-pre">{code}</pre>
      </div>
    </div>
  )
}
