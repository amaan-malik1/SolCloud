import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { User, Wallet, Lock, Bell, Trash2, AlertTriangle, CheckCircle, ExternalLink, Copy, Check } from 'lucide-react'
import { SettingsSection } from '../../components/shared/SettingsSection'
import { Toggle } from '../../components/shared/Toggle'
import { FormField } from '../../components/shared/FormField'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { useProfile, useNotificationPrefs, useUpdateWallet, useChangePassword, useUpdateNotifications, useDeleteAccount } from '../../hooks/useSettings'
import { formatUsd, shortenAddress } from '../../lib/utils'

function AccountCard() {
  const { data: profile, isLoading } = useProfile()
  const [copiedId, setCopiedId] = useState(false)
  const handleCopyId = async () => { if (!profile?.id) return; await navigator.clipboard.writeText(profile.id); setCopiedId(true); setTimeout(() => setCopiedId(false), 2000) }

  if (isLoading) return <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}><LoadingSpinner className="w-4 h-4" /><span className="text-sm text-white/30 font-body">Loading...</span></div>
  if (!profile) return null

  return (
    <div className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold text-sol-purple flex-shrink-0" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}>{profile.email[0].toUpperCase()}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{profile.email}</p>
          <p className="text-xs text-white/35 font-body">Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {[{ label: 'Balance', value: formatUsd(profile.balanceUsd) }, { label: 'Payments', value: String(profile.totalTransactions) }, { label: 'Plan', value: 'Free' }].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-sm font-display font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/30 font-body">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="min-w-0">
          <p className="text-xs text-white/25 font-body mb-0.5">User ID</p>
          <p className="text-xs font-mono text-white/40 truncate">{profile.id}</p>
        </div>
        <button onClick={handleCopyId} className="ml-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
          {copiedId ? <Check className="w-3.5 h-3.5 text-sol-green" /> : <Copy className="w-3.5 h-3.5 text-white/25 hover:text-white/50" />}
        </button>
      </div>
    </div>
  )
}

function WalletSection() {
  const { data: profile, isLoading } = useProfile()
  const { publicKey, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const updateWallet = useUpdateWallet()
  const [manualAddress, setManualAddress] = useState('')
  const [useManual, setUseManual] = useState(false)

  const handleLink = async (manual: boolean) => {
    const address = manual ? manualAddress.trim() : publicKey?.toBase58() ?? ''
    if (!address) return
    setUseManual(manual)
    await updateWallet.mutateAsync(address)
  }

  if (isLoading) return <LoadingSpinner className="w-4 h-4" />

  return (
    <div className="space-y-4">
      {profile?.walletAddress ? (
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(20,241,149,0.05)', border: '1px solid rgba(20,241,149,0.15)' }}>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-sol-green" />
            <div><p className="text-xs text-sol-green font-medium">Wallet linked</p><p className="text-xs font-mono text-white/45 mt-0.5">{shortenAddress(profile.walletAddress, 8)}</p></div>
          </div>
          <a href={`https://explorer.solana.com/address/${profile.walletAddress}?cluster=devnet`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-white/25 hover:text-white/50" />
          </a>
        </div>
      ) : <p className="text-sm text-white/40 font-body">No wallet linked yet.</p>}

      <div className="space-y-3">
        {connected && publicKey && (
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div><p className="text-xs font-medium text-white">Use connected wallet</p><p className="text-xs font-mono text-white/35 mt-0.5">{shortenAddress(publicKey.toBase58())}</p></div>
            <button onClick={() => handleLink(false)} disabled={updateWallet.isPending} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-sol-purple/20 border border-sol-purple/30 hover:bg-sol-purple/30 transition-colors disabled:opacity-50">
              {updateWallet.isPending && !useManual ? 'Linking...' : 'Link this wallet'}
            </button>
          </div>
        )}
        {!connected && (
          <button onClick={() => setVisible(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-white/20 hover:text-white/80 transition-all">
            <Wallet className="w-4 h-4" />Connect wallet to link
          </button>
        )}
        <div className="space-y-2">
          <p className="text-xs text-white/30 font-body">Or paste an address manually</p>
          <div className="flex gap-2">
            <input type="text" value={manualAddress} onChange={e => setManualAddress(e.target.value)} placeholder="Solana wallet address..."
              className="flex-1 px-3 py-2 rounded-xl text-xs font-mono text-white placeholder:text-white/20 outline-none bg-white/5 border border-white/10 focus:border-sol-purple/40 transition-colors" />
            <button onClick={() => handleLink(true)} disabled={!manualAddress.trim() || updateWallet.isPending}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-white/8 border border-white/10 hover:border-white/20 transition-all disabled:opacity-40">
              {updateWallet.isPending && useManual ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordSection() {
  const changePassword = useChangePassword()
  const [current, setCurrent] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!current) e.current = 'Required'
    if (newPass.length < 8) e.newPass = 'At least 8 characters'
    if (newPass === current) e.newPass = 'Must be different from current'
    if (newPass !== confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(); setErrors(errs)
    if (Object.keys(errs).length > 0) return
    await changePassword.mutateAsync({ currentPassword: current, newPassword: newPass })
    setCurrent(''); setNewPass(''); setConfirm(''); setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Current password" id="current-password" type="password" value={current} onChange={setCurrent} error={errors.current} placeholder="Your current password" autoComplete="current-password" />
      <FormField label="New password" id="new-password" type="password" value={newPass} onChange={setNewPass} error={errors.newPass} placeholder="At least 8 characters" autoComplete="new-password" />
      <FormField label="Confirm new password" id="confirm-password" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} placeholder="Repeat new password" autoComplete="new-password" />
      <button type="submit" disabled={changePassword.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-sol-purple to-[#7233cc] disabled:opacity-50 transition-all" style={{ boxShadow: '0 0 16px rgba(153,69,255,0.25)' }}>
        {changePassword.isPending ? <><LoadingSpinner className="w-4 h-4" />Updating...</> : <><Lock className="w-4 h-4" />Update password</>}
      </button>
    </form>
  )
}

function NotificationsSection() {
  const { data: prefs, isLoading } = useNotificationPrefs()
  const updateNotifications = useUpdateNotifications()
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [threshold, setThreshold] = useState(2)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (prefs && !initialized) { setEmailAlerts(prefs.emailAlerts); setThreshold(prefs.lowBalanceThreshold); setInitialized(true) }
  }, [prefs, initialized])

  if (isLoading) return <LoadingSpinner className="w-4 h-4" />

  return (
    <div className="space-y-4">
      <Toggle checked={emailAlerts} onChange={setEmailAlerts} label="Low balance email alert" description="Get an email when your balance drops below the threshold" />
      <div className={`space-y-3 transition-opacity ${!emailAlerts ? 'opacity-40 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between">
          <label className="text-sm text-white/60 font-body">Alert threshold</label>
          <span className="text-sm font-medium text-white font-mono">${threshold.toFixed(2)}</span>
        </div>
        <input type="range" min={0.5} max={10} step={0.5} value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} className="w-full accent-sol-purple" />
        <div className="flex justify-between text-xs text-white/25 font-body"><span>$0.50</span><span>$10.00</span></div>
      </div>
      <Toggle checked={false} onChange={() => {}} label="Monthly usage report" description="Coming soon — monthly storage summary via email" disabled />
      <button onClick={() => updateNotifications.mutate({ emailAlerts, lowBalanceThreshold: threshold })} disabled={updateNotifications.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all disabled:opacity-50">
        {updateNotifications.isPending ? <><LoadingSpinner className="w-4 h-4" />Saving...</> : <><Bell className="w-4 h-4" />Save preferences</>}
      </button>
    </div>
  )
}

function DeleteSection() {
  const deleteAccount = useDeleteAccount()
  const [step, setStep] = useState<'idle' | 'confirm' | 'final'>('idle')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!password) { setError('Password is required'); return }
    try { await deleteAccount.mutateAsync(password) }
    catch (err: any) { setError(err?.response?.data?.error ?? 'Failed to delete account') }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/45 font-body leading-relaxed">Deleting your account will immediately revoke your R2 credentials, clear your balance, and permanently remove all your data. This cannot be undone.</p>
      {step === 'idle' && (
        <button onClick={() => setStep('confirm')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-400/20 hover:border-red-400/40 hover:bg-red-400/5 transition-all">
          <Trash2 className="w-4 h-4" />Delete my account
        </button>
      )}
      {step === 'confirm' && (
        <div className="p-4 rounded-xl space-y-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white mb-1">This will permanently delete your account</p>
              <ul className="text-xs text-white/40 font-body space-y-1">
                <li>• Your R2 bucket access will be revoked immediately</li>
                <li>• Your remaining balance will be lost</li>
                <li>• All transaction history will be deleted</li>
                <li>• This action cannot be reversed</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('final')} className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors">I understand, continue</button>
            <button onClick={() => setStep('idle')} className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 'final' && (
        <div className="p-4 rounded-xl space-y-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="text-sm text-white font-medium">Enter your password to confirm</p>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Your account password"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-body text-white placeholder:text-white/25 outline-none bg-white/5 border border-red-500/30 focus:border-red-500/60 transition-colors" />
          {error && <p className="text-xs text-red-400 font-body">⚠ {error}</p>}
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleteAccount.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50">
              {deleteAccount.isPending ? <><LoadingSpinner className="w-3.5 h-3.5" />Deleting...</> : <><Trash2 className="w-3.5 h-3.5" />Delete account forever</>}
            </button>
            <button onClick={() => { setStep('idle'); setPassword(''); setError('') }} disabled={deleteAccount.isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all disabled:opacity-50">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div><h1 className="font-display font-bold text-2xl text-white tracking-tight">Settings</h1><p className="text-white/40 text-sm font-body mt-1">Manage your account and preferences</p></div>

      <SettingsSection title="Account" description="Your profile and account information">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.2)' }}><User className="w-4 h-4 text-sol-purple" /></div>
          <p className="text-sm text-white/60 font-body">Account overview</p>
        </div>
        <AccountCard />
      </SettingsSection>

      <SettingsSection title="Wallet" description="Link your Solana wallet for faster payment recognition">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.2)' }}><Wallet className="w-4 h-4 text-sol-green" /></div>
          <p className="text-sm text-white/60 font-body">Linked wallet address</p>
        </div>
        <WalletSection />
      </SettingsSection>

      <SettingsSection title="Password" description="Change your account password — minimum 8 characters">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)' }}><Lock className="w-4 h-4 text-sol-blue" /></div>
          <p className="text-sm text-white/60 font-body">Update your password</p>
        </div>
        <PasswordSection />
      </SettingsSection>

      <SettingsSection title="Notifications" description="Control when and how SolStore contacts you">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,190,50,0.1)', border: '1px solid rgba(255,190,50,0.2)' }}><Bell className="w-4 h-4 text-amber-400" /></div>
          <p className="text-sm text-white/60 font-body">Email preferences</p>
        </div>
        <NotificationsSection />
      </SettingsSection>

      <SettingsSection title="Danger zone" description="Irreversible actions — proceed with caution" danger>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}><Trash2 className="w-4 h-4 text-red-400" /></div>
          <p className="text-sm text-white/60 font-body">Delete account</p>
        </div>
        <DeleteSection />
      </SettingsSection>
    </div>
  )
}
