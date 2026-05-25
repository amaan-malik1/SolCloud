import { Link } from 'react-router-dom'
import { DollarSign, HardDrive, Zap, CreditCard, Key, ArrowRight, Wifi, WifiOff } from 'lucide-react'
import { StatCard } from '../../components/shared/StatCard'
import { TransactionRow } from '../../components/shared/TransactionRow'
import { GracePeriodBanner } from '../../components/shared/GracePeriodBanner'
import { UsageChart } from '../../components/shared/UsageChart'
import { useAuthStore } from '../../store/auth.store'
import { useBalance, useStorageStatus, useTransactions, useSolanaStatus, useSuspensionStatus, useUsageHistory } from '../../hooks/useDashboard'
import { formatBytes, formatUsd } from '../../lib/utils'

export default function DashboardHome() {
  const { user } = useAuthStore()
  const { data: balance, isLoading: balanceLoading } = useBalance()
  const { data: storage, isLoading: storageLoading } = useStorageStatus()
  const { data: transactions, isLoading: txLoading } = useTransactions()
  const { data: solana } = useSolanaStatus()
  const { data: suspensionStatus } = useSuspensionStatus()
  const { data: historyData } = useUsageHistory(7)
  const firstName = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">Hey, {firstName} </h1>
          <p className="text-white/40 text-sm font-body mt-1">Here's your SolStore overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body surface-card">
          {solana?.connected
            ? <><Wifi className="w-3 h-3 text-sol-green" /><span className="text-sol-green">{solana.network ?? 'devnet'}</span></>
            : <><WifiOff className="w-3 h-3 text-red-400" /><span className="text-red-400">Disconnected</span></>}
        </div>
      </div>

      {suspensionStatus && (suspensionStatus.inGracePeriod || suspensionStatus.status === 'SUSPENDED') && (
        <GracePeriodBanner status={suspensionStatus} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Balance" value={formatUsd(balance?.amountUsd ?? 0)} sub="Available credit" icon={DollarSign} accent="green" isLoading={balanceLoading} />
        <StatCard label="Storage" value={storage?.hasStorage ? formatBytes(storage.storageBytes ?? 0) : 'Not provisioned'}
          sub={storage?.hasStorage ? (storage.status === 'ACTIVE' ? 'Bucket active' : 'Bucket suspended') : 'Send SOL to activate'}
          icon={HardDrive} accent={storage?.status === 'ACTIVE' ? 'purple' : 'default'} isLoading={storageLoading} />
        <StatCard label="Transactions" value={String(transactions?.length ?? 0)} sub="Total payments received" icon={Zap} accent="blue" isLoading={txLoading} />
      </div>

      {!storageLoading && !storage?.hasStorage && (
        <div className="p-5 rounded-xl flex items-center justify-between" style={{ background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.2)' }}>
          <div>
            <p className="text-sm font-medium text-white mb-1">Your storage isn't set up yet</p>
            <p className="text-xs text-white/45 font-body">Send SOL to your account to instantly provision a Cloudflare R2 bucket.</p>
          </div>
          <Link to="/dashboard/payment" className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg text-sm font-medium text-white bg-sol-purple/20 border border-sol-purple/30 hover:bg-sol-purple/30 transition-colors">Add funds →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl surface-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-base text-white">Recent payments</h2>
            <span className="text-xs text-white/30 font-body">Last {Math.min(transactions?.length ?? 0, 5)}</span>
          </div>
          {txLoading && <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}</div>}
          {!txLoading && (!transactions || transactions.length === 0) && (
            <div className="text-center py-8"><p className="text-white/25 text-sm font-body">No payments yet</p></div>
          )}
          {!txLoading && transactions && transactions.length > 0 && (
            <div>{transactions.slice(0, 5).map((tx: any) => <TransactionRow key={tx.id} tx={tx} />)}</div>
          )}
        </div>

        <div className="p-6 rounded-2xl surface-card">
          <h2 className="font-display font-semibold text-base text-white mb-5">Quick actions</h2>
          <div className="flex flex-col gap-3">
            {[
              { to: '/dashboard/payment', icon: CreditCard, color: 'sol-purple', title: 'Add funds', sub: 'Send SOL from your wallet' },
              { to: '/dashboard/credentials', icon: Key, color: 'sol-green', title: 'View credentials', sub: 'R2 access keys + endpoint' },
              { to: '/dashboard/storage', icon: HardDrive, color: 'sol-blue', title: 'Storage details', sub: 'Bucket info + usage' },
            ].map(({ to, icon: Icon, color, title, sub }) => (
              <Link key={to} to={to} className="flex items-center justify-between p-4 rounded-xl border border-white/7 hover:bg-white/3 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-${color}/10 border border-${color}/20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-white/35 font-body">{sub}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {storage?.hasStorage && historyData && historyData.chart.length > 1 && (
        <div className="p-6 rounded-2xl surface-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-base text-white">Storage (7 days)</h2>
            <Link to="/dashboard/storage" className="text-xs text-white/30 hover:text-white/60 transition-colors font-body">Full history →</Link>
          </div>
          <UsageChart data={historyData.chart} height={120} showGrid={false} />
        </div>
      )}
    </div>
  )
}
