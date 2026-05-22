import { ExternalLink } from 'lucide-react'
import { formatUsd } from '../../lib/utils'

interface Transaction { id: string; txSignature: string; solAmount: number | string; usdAmount: number | string; solPriceUsd: number | string; status: string; createdAt: string }

export function TransactionRow({ tx }: { tx: Transaction }) {
  const solAmount = Number(tx.solAmount)
  const usdAmount = Number(tx.usdAmount)
  const explorerUrl = `https://explorer.solana.com/tx/${tx.txSignature}?cluster=${import.meta.env.VITE_SOLANA_NETWORK ?? 'devnet'}`

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tx.status === 'CONFIRMED' ? 'bg-sol-green' : 'bg-red-400'}`} style={tx.status === 'CONFIRMED' ? { boxShadow: '0 0 6px #14F195' } : undefined} />
        <div>
          <p className="text-sm text-white font-body">+{solAmount.toFixed(4)} SOL</p>
          <p className="text-xs text-white/35 font-body">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white font-body">{formatUsd(usdAmount)}</p>
          <p className="text-xs text-white/30 font-body">@ ${Number(tx.solPriceUsd).toFixed(2)}/SOL</p>
        </div>
        <a href={explorerUrl} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5 text-white/30 hover:text-white/60" />
        </a>
      </div>
    </div>
  )
}
