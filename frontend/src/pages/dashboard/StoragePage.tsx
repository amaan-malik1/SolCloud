import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HardDrive, RefreshCw, CreditCard, ExternalLink, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { storageApi } from '../../api/storage.api'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { UsageBar } from '../../components/shared/UsageBar'
import { DetailRow } from '../../components/shared/DetailRow'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { GracePeriodBanner } from '../../components/shared/GracePeriodBanner'
import { UsageChart } from '../../components/shared/UsageChart'
import { CostChart } from '../../components/shared/CostChart'
import { useSuspensionStatus, useUsageHistory, useDailyCost, useRefreshUsage } from '../../hooks/useDashboard'
import { formatBytes, formatUsd } from '../../lib/utils'

const FREE_TIER = 10 * 1024 * 1024 * 1024

export default function StoragePage() {
  const queryClient = useQueryClient()
  const [historyDays, setHistoryDays] = useState(30)
  const { data: storage, isLoading } = useQuery({
    queryKey: ['storage-status'],
    queryFn: storageApi.getStatus,
    refetchInterval: 30_000,
  })
  const { data: details } = useQuery({ queryKey: ['storage-credentials'], queryFn: storageApi.getCredentials, enabled: storage?.hasStorage && storage?.status === 'ACTIVE', retry: false })
  const { data: suspensionStatus } = useSuspensionStatus()
  const { data: historyData, isLoading: historyLoading } = useUsageHistory(historyDays)
  const { data: costData, isLoading: costLoading } = useDailyCost(historyDays)
  const refreshUsage = useRefreshUsage()

  if (isLoading) return <div className="flex items-center justify-center h-64"><LoadingSpinner className="w-6 h-6" /></div>

  if (!storage?.hasStorage) return (
    <div className="space-y-6">
      <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Storage</h1><p className="text-white/40 text-sm font-body mt-1">Your Cloudflare R2 bucket</p></div>
      <div className="rounded-2xl p-12 text-center surface-card">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}>
          <HardDrive className="w-7 h-7 text-sol-purple" />
        </div>
        <h2 className="font-display font-semibold text-lg text-white mb-2">No storage provisioned yet</h2>
        <p className="text-sm text-white/40 font-body max-w-sm mx-auto mb-8 leading-relaxed">Send SOL to your account and a dedicated Cloudflare R2 bucket will be created automatically within seconds.</p>
        <Link to="/dashboard/payment" className="glow-purple px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sol-purple to-[#7233cc] inline-flex items-center gap-2">
          <CreditCard className="w-4 h-4" />Add funds to activate
        </Link>
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[{ label: '10 GB', sub: 'Free storage' }, { label: '$0.00', sub: 'Egress fees' }, { label: 'S3', sub: 'Compatible API' }].map(item => (
            <div key={item.label} className="text-center">
              <p className="font-display font-bold text-white text-lg">{item.label}</p>
              <p className="text-xs text-white/30 font-body">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Storage</h1><p className="text-white/40 text-sm font-body mt-1">Your Cloudflare R2 bucket</p></div>
        <button onClick={() => refreshUsage.mutate()} disabled={refreshUsage.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all disabled:opacity-40">
          <RefreshCw className={`w-4 h-4 ${refreshUsage.isPending ? 'animate-spin' : ''}`} />Refresh usage
        </button>
      </div>

      {suspensionStatus && (suspensionStatus.inGracePeriod || suspensionStatus.status === 'SUSPENDED') && (
        <GracePeriodBanner status={suspensionStatus} />
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl surface-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-base text-white">Usage</h2>
              <StatusBadge status={storage?.status ?? 'PENDING'} pulse />
            </div>
            <UsageBar usedBytes={storage?.storageBytes ?? 0} limitBytes={FREE_TIER} />
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              {[
                { label: 'Used', value: formatBytes(storage?.storageBytes ?? 0), color: 'text-white' },
                {
                  label: 'Available',
                  value: Math.max(0, FREE_TIER - (storage?.storageBytes ?? 0)) > 0
                    ? formatBytes(FREE_TIER - (storage?.storageBytes ?? 0))
                    : 'Over limit',
                  color: (storage?.storageBytes ?? 0) > FREE_TIER ? 'text-red-400' : 'text-sol-green'
                },
                { label: 'Limit', value: formatBytes(FREE_TIER), color: 'text-white/50' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className={`font-display font-bold text-lg ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-white/30 font-body mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl surface-card">
            <h2 className="font-display font-semibold text-base text-white mb-1">Bucket details</h2>
            <p className="text-xs text-white/30 font-body mb-5">Your dedicated R2 bucket information</p>
            <DetailRow label="Bucket name" value={storage?.bucketName ?? '—'} mono copyable />
            <DetailRow label="Provider" value="Cloudflare R2" />
            <DetailRow label="Region" value="Auto (Global)" />
            <DetailRow label="Egress fees" value="$0.00 / GB" />
            {details?.credentials?.endpoint && <DetailRow label="Endpoint" value={details.credentials.endpoint} mono copyable truncate />}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl surface-card">
            <h3 className="font-display font-semibold text-sm text-white mb-4">Pricing</h3>
            <div className="space-y-3">
              {[{ label: 'Storage', value: '$0.02 / GB·mo' }, { label: 'Reads', value: '$0.36 / million' }, { label: 'Writes', value: '$4.50 / million' }, { label: 'Egress', value: 'FREE' }].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/40 font-body">{item.label}</span>
                  <span className={`text-xs font-mono font-medium ${item.value === 'FREE' ? 'text-sol-green' : 'text-white'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-white/25 font-body leading-relaxed">Billed daily from your SOL balance. Auto-suspend on zero balance.</div>
          </div>

          <div className="p-5 rounded-2xl surface-card">
            <div className="flex items-center gap-2 mb-3"><Package className="w-4 h-4 text-white/40" /><h3 className="font-display font-semibold text-sm text-white">SDK quickstart</h3></div>
            <div className="rounded-lg p-3 text-xs font-mono text-white/50 leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-white/25 mb-1"># Install</p>
              <p className="text-sol-green mb-3">npm i @aws-sdk/client-s3</p>
              <p className="text-white/25 mb-1"># Configure</p>
              <p>endpoint: r2.cloudflarestorage.com</p>
              <p>region: 'auto'</p>
            </div>
            <Link to="/dashboard/credentials" className="mt-3 w-full py-2 rounded-lg text-xs font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all flex items-center justify-center gap-1.5">View full credentials →</Link>
          </div>
        </div>
      </div>

      {/* Usage history chart */}
      <div className="p-6 rounded-2xl surface-card">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="font-display font-semibold text-base text-white">Storage history</h2><p className="text-xs text-white/30 font-body mt-0.5">{historyData?.dataPoints ?? 0} data points</p></div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setHistoryDays(d)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${historyDays === d ? 'bg-sol-purple/20 text-sol-purple border border-sol-purple/30' : 'text-white/40 hover:text-white/60'}`}>{d}d</button>
            ))}
          </div>
        </div>
        {historyLoading ? <div className="flex items-center justify-center h-48"><LoadingSpinner className="w-5 h-5" /></div> : <UsageChart data={historyData?.chart ?? []} height={200} />}
      </div>

      {/* Cost chart */}
      <div className="p-6 rounded-2xl surface-card">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="font-display font-semibold text-base text-white">Daily billing</h2><p className="text-xs text-white/30 font-body mt-0.5">Charges at midnight UTC</p></div>
          {costData && <div className="text-right"><p className="text-sm font-display font-bold text-sol-green">{formatUsd(costData.totalCost)}</p><p className="text-xs text-white/30 font-body">total last {historyDays}d</p></div>}
        </div>
        {costLoading ? <div className="flex items-center justify-center h-40"><LoadingSpinner className="w-5 h-5" /></div> : <CostChart data={costData?.chart ?? []} height={160} />}
        {costData?.chart.length === 0 && (
          <div className="rounded-xl p-4 mt-2" style={{ background: 'rgba(20,241,149,0.04)', border: '1px solid rgba(20,241,149,0.1)' }}>
            <p className="text-xs text-sol-green/70 font-body text-center">No charges yet — you're within the 10 GB free tier</p>
          </div>
        )}
      </div>
    </div>
  )
}
