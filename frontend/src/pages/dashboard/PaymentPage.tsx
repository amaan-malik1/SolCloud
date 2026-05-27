import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Wallet, Send, CheckCircle, AlertCircle, Clock, ExternalLink, RefreshCw, ChevronRight, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { sendPayment } from '../../lib/payment'
import { storageApi } from '../../api/storage.api'
import { solanaApi } from '../../api/solana.api'
import { useAuthStore } from '../../store/auth.store'
import { useWalletBalance } from '../../hooks/useWalletBalance'
import { usePaymentConfirmation } from '../../hooks/usePaymentConfirmation'
import { StepIndicator } from '../../components/shared/StepIndicator'
import { formatUsd, shortenAddress } from '../../lib/utils'

const STEPS = [
  { label: 'Connect wallet', sub: 'Phantom or Solflare' },
  { label: 'Enter amount', sub: 'Minimum 0.01 SOL' },
  { label: 'Send transaction', sub: 'Sign with your wallet' },
  { label: 'Confirmed', sub: 'Balance updated automatically' },
]
const PRESET_AMOUNTS = [0.1, 0.5, 1, 2]
const NETWORK = import.meta.env.VITE_SOLANA_NETWORK ?? 'devnet'

export default function PaymentPage() {
  const { user } = useAuthStore()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { balance: walletBalance } = useWalletBalance()
  const queryClient = useQueryClient()
  const { status, creditedUsd, startPolling, reset } = usePaymentConfirmation()

  const [solAmount, setSolAmount] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [solPrice, setSolPrice] = useState<number | null>(null)

  const { data: solanaStatus } = useQuery({ queryKey: ['solana-status'], queryFn: solanaApi.getStatus })
  const { data: currentBalance } = useQuery({ queryKey: ['balance'], queryFn: storageApi.getBalance })

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then(r => r.json()).then(d => setSolPrice(d?.solana?.usd ?? null)).catch(() => { })
  }, [])

  useEffect(() => {
    if (status === 'confirmed') {
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['storage-status'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['suspension-status'] })
    }
  }, [status, queryClient])

  const parsedSol = parseFloat(solAmount) || 0
  const usdPreview = solPrice ? parsedSol * solPrice : null
  const isValidAmount = parsedSol >= 0.01 && (walletBalance === null || parsedSol <= walletBalance)
  const currentStep = !wallet.connected ? 0 : status === 'confirmed' ? 4 : status === 'waiting' || isSending ? 3 : 1
  const explorerUrl = txSignature ? `https://explorer.solana.com/tx/${txSignature}?cluster=${NETWORK}` : null

  const handleSend = async () => {
    if (!wallet.connected || !user || !isValidAmount) return

    // fetch fresh balance right now, before transaction
    let previousBalance = 0
    try {
      const fresh = await storageApi.getBalance()
      previousBalance = fresh.amountUsd
      console.log('[payment] Fresh balance before send:', previousBalance)
    } catch {
      previousBalance = currentBalance?.amountUsd ?? 0
    }

    setIsSending(true)
    try {
      const result = await sendPayment({
        wallet,
        platformAddress: solanaStatus?.platformAddress ?? '',
        solAmount: parsedSol,
        userId: user.id,
      })
      setTxSignature(result.signature)
      toast.success('Transaction sent! Waiting for confirmation...')
      await startPolling(previousBalance)
    } catch (err: any) {
      const msg = err?.message ?? 'Transaction failed'
      toast.error(msg.includes('rejected') || msg.includes('cancelled') ? 'Transaction cancelled' : msg)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Add funds</h1><p className="text-white/40 text-sm font-body mt-1">Send SOL to instantly credit your account</p></div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl surface-card h-fit">
          <p className="text-xs text-white/30 font-body uppercase tracking-wider mb-6">How it works</p>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="md:col-span-3 space-y-4">
          {status === 'confirmed' && (
            <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(20,241,149,0.05)', border: '1px solid rgba(20,241,149,0.2)' }}>
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)' }}>
                <CheckCircle className="w-7 h-7 text-sol-green" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Payment confirmed!</h2>
              <p className="text-white/50 text-sm font-body mb-1">{formatUsd(creditedUsd ?? 0)} added to your balance</p>
              <p className="text-white/30 text-xs font-body mb-6">Storage will provision automatically if not already active</p>
              {explorerUrl && <a href={explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-sol-green/70 hover:text-sol-green transition-colors mb-6 font-body"><ExternalLink className="w-3 h-3" />View on Explorer</a>}
              <button onClick={() => { reset(); setSolAmount(''); setTxSignature(null) }} className="w-full py-2.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-white/20 hover:text-white/80 transition-all">Send another payment</button>
            </div>
          )}

          {status === 'waiting' && (
            <div className="p-8 rounded-2xl text-center" style={{ background: 'rgba(153,69,255,0.05)', border: '1px solid rgba(153,69,255,0.2)' }}>
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.3)' }}>
                <Clock className="w-7 h-7 text-sol-purple animate-pulse" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Waiting for confirmation</h2>
              <p className="text-white/40 text-sm font-body mb-6">Our indexer checks the blockchain every 2 seconds. Usually under 10 seconds.</p>
              <div className="flex justify-center gap-1.5 mb-6">
                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-sol-purple/60" style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
              </div>
              {explorerUrl && <a href={explorerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors font-body"><ExternalLink className="w-3 h-3" />{shortenAddress(txSignature ?? '')}</a>}
            </div>
          )}

          {status === 'timeout' && (
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Confirmation timeout</p>
                  <p className="text-xs text-white/45 font-body mb-3">Transaction sent but not detected yet. Your balance will update when the indexer picks it up.</p>
                  <button onClick={reset} className="text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"><RefreshCw className="w-3 h-3" />Try again</button>
                </div>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <>
              {!wallet.connected ? (
                <div className="p-6 rounded-2xl surface-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}>
                      <Wallet className="w-4 h-4 text-sol-purple" />
                    </div>
                    <div><p className="text-sm font-medium text-white">Connect your wallet</p><p className="text-xs text-white/40 font-body">Phantom or Solflare supported</p></div>
                  </div>
                  <button onClick={() => setVisible(true)} className="w-full py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sol-purple to-[#7233cc] glow-purple">Connect wallet</button>
                  <p className="text-xs text-white/25 text-center mt-3 font-body">We never request approval to spend your funds — you control every transaction</p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl surface-card space-y-5">
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(20,241,149,0.05)', border: '1px solid rgba(20,241,149,0.15)' }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-sol-green" style={{ boxShadow: '0 0 6px #14F195' }} />
                      <span className="text-xs font-mono text-white/60">{shortenAddress(wallet.publicKey?.toBase58() ?? '')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40 font-body">{walletBalance !== null ? `${walletBalance.toFixed(4)} SOL` : '—'}</span>
                      <button onClick={() => wallet.disconnect()} className="text-xs text-white/25 hover:text-white/50 transition-colors">Disconnect</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 font-body">Amount</label>
                    <div className="flex items-center gap-3 px-4 rounded-xl border border-white/10 focus-within:border-sol-purple/50 transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <input type="number" value={solAmount} onChange={(e) => setSolAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01"
                        className="flex-1 py-3 bg-transparent outline-none text-white text-lg font-display placeholder:text-white/20" />
                      <span className="text-sm text-white/40 font-body font-medium">SOL</span>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs text-white/30 font-body">{usdPreview !== null && parsedSol > 0 ? `≈ ${formatUsd(usdPreview)}` : 'Enter SOL amount'}</span>
                      {walletBalance !== null && parsedSol > walletBalance && <span className="text-xs text-red-400 font-body">Insufficient balance</span>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-white/30 font-body">Quick amounts</p>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_AMOUNTS.map(amt => (
                        <button key={amt} onClick={() => setSolAmount(String(amt))}
                          className={`py-2 rounded-lg text-sm font-medium transition-all font-body border ${parseFloat(solAmount) === amt ? 'border-sol-purple/50 bg-sol-purple/10 text-sol-purple' : 'border-white/8 text-white/40 hover:border-white/15 hover:text-white/60'}`}>
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs text-white/30 font-body">Sending to</p>
                    <p className="text-xs font-mono text-white/50 break-all">{solanaStatus?.platformAddress ?? 'Loading...'}</p>
                    <p className="text-xs text-white/20 font-body">SolStore platform wallet · {NETWORK}</p>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'rgba(153,69,255,0.05)', border: '1px solid rgba(153,69,255,0.12)' }}>
                    <Zap className="w-3.5 h-3.5 text-sol-purple/60 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/35 font-body leading-relaxed">Your user ID is automatically embedded in the transaction memo. The indexer uses this to credit your account — no manual step needed.</p>
                  </div>

                  <button onClick={handleSend} disabled={!isValidAmount || isSending}
                    className="w-full py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-sol-purple to-[#7233cc] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    style={isValidAmount ? { boxShadow: '0 0 20px rgba(153,69,255,0.3)' } : {}}>
                    {isSending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send {parsedSol > 0 ? `${parsedSol} SOL` : 'SOL'}<ChevronRight className="w-4 h-4" /></>}
                  </button>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[{ icon: '⚡', label: 'Fast', sub: '< 10 sec confirmation' }, { icon: '🔒', label: 'Secure', sub: 'Non-custodial signing' }, { icon: '🔍', label: 'Transparent', sub: 'On-chain verifiable' }].map(item => (
              <div key={item.label} className="p-3 rounded-xl text-center surface-card">
                <p className="text-lg mb-1">{item.icon}</p>
                <p className="text-xs font-medium text-white/70">{item.label}</p>
                <p className="text-xs text-white/30 font-body mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
