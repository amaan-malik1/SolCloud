import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Key, AlertTriangle, RefreshCw, CreditCard, Shield, Terminal } from 'lucide-react'
import toast from 'react-hot-toast'
import { storageApi } from '../../api/storage.api'
import { SecretField } from '../../components/shared/SecretField'
import { CodeSnippet } from '../../components/shared/CodeSnippet'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { getNodeSnippet, getPythonSnippet, getCliSnippet, getEnvSnippet } from '../../lib/snippets'
import { useRotationHistory } from '../../hooks/useDashboard'

type SnippetTab = 'node' | 'python' | 'cli' | 'env'
const TABS = [
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
  { id: 'cli', label: 'AWS CLI' },
  { id: 'env', label: '.env' },
]

export default function CredentialsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<SnippetTab>('node')
  const [showConfirm, setShowConfirm] = useState(false)
  const { data: rotationData } = useRotationHistory()

  const { data, isLoading, error } = useQuery({ queryKey: ['storage-credentials'], queryFn: storageApi.getCredentials, retry: false })

  const regenMutation = useMutation({
    mutationFn: storageApi.regenerateKeys,
    onSuccess: () => { toast.success('Keys regenerated — update your apps with the new credentials'); queryClient.invalidateQueries({ queryKey: ['storage-credentials'] }); setShowConfirm(false) },
    onError: () => { toast.error('Failed to regenerate keys'); setShowConfirm(false) },
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><LoadingSpinner className="w-6 h-6" /></div>

  if (error || !data) {
    const isSuspended = (error as any)?.response?.status === 403
    return (
      <div className="space-y-6">
        <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Credentials</h1><p className="text-white/40 text-sm font-body mt-1">Your R2 access keys</p></div>
        <div className="p-12 rounded-2xl text-center surface-card">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: isSuspended ? 'rgba(239,68,68,0.1)' : 'rgba(153,69,255,0.1)', border: isSuspended ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(153,69,255,0.2)' }}>
            <Key className="w-6 h-6" style={{ color: isSuspended ? '#f87171' : '#9945FF' }} />
          </div>
          <h2 className="font-display font-semibold text-lg text-white mb-2">{isSuspended ? 'Storage suspended' : 'No credentials yet'}</h2>
          <p className="text-sm text-white/40 font-body max-w-xs mx-auto mb-8 leading-relaxed">{isSuspended ? 'Top up your balance to reactivate your bucket and access credentials.' : 'Send SOL to provision your R2 bucket. Credentials will appear here instantly.'}</p>
          <Link to="/dashboard/payment" className="glow-purple inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sol-purple to-[#7233cc]">
            <CreditCard className="w-4 h-4" />{isSuspended ? 'Add funds to reactivate' : 'Add funds to get started'}
          </Link>
        </div>
      </div>
    )
  }

  const { bucket, credentials } = data;

  const snippetParams = {
    endpoint: credentials.endpoint,
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    bucketName: bucket.name,
    region: credentials.region
  }

  const snippetMap: Record<SnippetTab, string> = {
    node: getNodeSnippet(snippetParams),
    python: getPythonSnippet(snippetParams),
    cli: getCliSnippet(snippetParams),
    env: getEnvSnippet(snippetParams)
  }

  const labelMap: Record<SnippetTab, string> = {
    node: 'storage.ts',
    python: 'storage.py',
    cli: 'terminal',
    env: '.env'
  }
  const installMap: Record<string, string | null> = {
    node: 'npm install @aws-sdk/client-s3  # Works with Cloudflare R2',
    python: 'pip install boto3  # Works with Cloudflare R2',
    cli: 'pip install awscli  # Works with Cloudflare R2',
    env: null,
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Credentials</h1><p className="text-white/40 text-sm font-body mt-1">Your R2 access keys — keep these secret</p></div>
        <StatusBadge status={bucket.status} pulse />
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <Shield className="w-4 h-4 text-red-400/70 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-red-400/80 mb-0.5">Keep your secret key private</p>
          <p className="text-xs text-white/35 font-body leading-relaxed">Never commit these to Git or share them publicly. If compromised, use the regenerate button below to instantly revoke and replace them.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl surface-card space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-semibold text-base text-white">Access keys</h2>
          <span className="text-xs text-white/25 font-body">Bucket: {bucket.name}</span>
        </div>
        <SecretField label="Access Key ID" value={credentials.accessKeyId} isSecret={false} mono />
        <SecretField label="Secret Access Key" value={credentials.secretAccessKey} isSecret mono />
        <SecretField label="Endpoint" value={credentials.endpoint} isSecret={false} mono />
        <div className="grid grid-cols-2 gap-4">
          <SecretField label="Bucket Name" value={bucket.name} isSecret={false} mono />
          <SecretField label="Region" value={credentials.region} isSecret={false} mono />
        </div>
      </div>

      <div className="p-6 rounded-2xl surface-card">
        <div className="flex items-center gap-2 mb-5"><Terminal className="w-4 h-4 text-white/40" /><h2 className="font-display font-semibold text-base text-white">SDK quickstart</h2></div>
        <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all font-body ${activeTab === tab.id ? 'bg-sol-purple/20 text-sol-purple border border-sol-purple/30' : 'text-white/40 hover:text-white/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {installMap[activeTab] && (
          <div className="flex items-center gap-2 p-3 rounded-lg mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs text-white/30 font-body">Install:</span>
            <code className="text-xs font-mono text-white/50">{installMap[activeTab]}</code>
          </div>
        )}
        <CodeSnippet code={snippetMap[activeTab]} label={labelMap[activeTab]} />
      </div>

      <div className="p-6 rounded-2xl surface-card">
        <h2 className="font-display font-semibold text-base text-white mb-1">Danger zone</h2>
        <p className="text-xs text-white/35 font-body mb-5 leading-relaxed">Regenerating keys immediately revokes your current credentials. Any app using the old keys will lose access instantly. Update all your apps right after.</p>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-400/20 hover:border-red-400/40 hover:bg-red-400/5 transition-all font-body">
            <RefreshCw className="w-4 h-4" />Regenerate API keys
          </button>
        ) : (
          <div className="p-4 rounded-xl space-y-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-1">Are you sure?</p>
                <p className="text-xs text-white/45 font-body leading-relaxed">Your current credentials will stop working immediately. Make sure you're ready to update all apps that use them.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => regenMutation.mutate()} disabled={regenMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors disabled:opacity-50">
                {regenMutation.isPending ? <><LoadingSpinner className="w-3.5 h-3.5" />Regenerating...</> : <><RefreshCw className="w-3.5 h-3.5" />Yes, regenerate</>}
              </button>
              <button onClick={() => setShowConfirm(false)} disabled={regenMutation.isPending} className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all disabled:opacity-50">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {rotationData?.history && rotationData.history.length > 0 && (
        <div className="p-6 rounded-2xl surface-card">
          <h2 className="font-display font-semibold text-base text-white mb-4">Key rotation history</h2>
          <div className="space-y-0">
            {rotationData.history.map(event => (
              <div key={event.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#9945FF' }} />
                  <div>
                    <p className="text-sm text-white capitalize font-body">{event.reason} rotation</p>
                    <p className="text-xs text-white/30 font-body">{event.ipAddress ? `from ${event.ipAddress}` : 'IP not recorded'}</p>
                  </div>
                </div>
                <span className="text-xs text-white/30 font-body">{new Date(event.rotatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
