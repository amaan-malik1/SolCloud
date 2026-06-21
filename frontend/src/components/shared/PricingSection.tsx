import { useEffect, useState } from 'react'
import { Check, Zap, Loader2 } from 'lucide-react'

interface Tier {
    id: 'FREE' | 'PRO' | 'TEAM'
    name: string
    monthlyPriceUsd: number
    includedStorageGb: number
    features: string[]
    recommended?: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function PricingSection() {
    const [tiers, setTiers] = useState<Tier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        fetch(`${API_URL}/api/billing/tiers`)
            .then(res => res.json())
            .then(data => {
                setTiers(data.tiers)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    return (
        <section style={{ padding: '80px 24px', background: '#050508' }}>
            <div style={{ maxWidth: 1080, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 14px', borderRadius: 100,
                        background: 'rgba(153,69,255,0.08)',
                        border: '1px solid rgba(153,69,255,0.2)',
                        fontSize: 12, color: '#9945FF',
                        fontFamily: 'DM Sans, sans-serif', marginBottom: 20,
                    }}>
                        <Zap size={12} /> Pricing
                    </div>

                    <h2 style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 800,
                        fontSize: 36, letterSpacing: '-1.5px',
                        color: '#fff', marginBottom: 14,
                    }}>
                        Start free. Scale when you need it.
                    </h2>

                    <p style={{
                        fontSize: 15, color: 'rgba(255,255,255,0.45)',
                        maxWidth: 480, margin: '0 auto', lineHeight: 1.7,
                        fontFamily: 'DM Sans, sans-serif',
                    }}>
                        No hidden bandwidth fees. Simple usage-based pricing,
                        powered by Solana.
                    </p>
                </div>

                {/* Tier cards — loading / error / loaded states */}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <Loader2 size={24} className="animate-spin" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    </div>
                )}

                {error && (
                    <p style={{
                        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 14,
                        fontFamily: 'DM Sans, sans-serif', padding: '40px 0',
                    }}>
                        Unable to load pricing right now — please refresh.
                    </p>
                )}

                {!loading && !error && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 20,
                        marginBottom: 56,
                    }}>
                        {tiers.map(tier => (
                            <TierCard key={tier.id} tier={tier} />
                        ))}
                    </div>
                )}

                {/* Usage pricing strip — also fetched, not hardcoded */}
                <UsageRateStrip />

            </div>
        </section>
    )
}

function TierCard({ tier }: { tier: Tier }) {
    return (
        <div style={{
            position: 'relative',
            background: tier.recommended ? 'rgba(153,69,255,0.04)' : 'rgba(255,255,255,0.02)',
            border: tier.recommended ? '1px solid rgba(153,69,255,0.35)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: '32px 28px',
        }}>
            {tier.recommended && (
                <div style={{
                    position: 'absolute', top: -12, left: 28,
                    padding: '4px 14px', borderRadius: 100,
                    background: 'linear-gradient(135deg,#9945FF,#7233cc)',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.3px',
                }}>
                    MOST POPULAR
                </div>
            )}

            <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.5)',
                fontFamily: 'DM Sans, sans-serif', marginBottom: 12,
            }}>
                {tier.name}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 38, color: '#fff', letterSpacing: '-1.5px',
                }}>
                    ${tier.monthlyPriceUsd}
                </span>
                <span style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'DM Sans, sans-serif',
                }}>
                    /month
                </span>
            </div>

            <p style={{
                fontSize: 13, color: '#14F195',
                fontFamily: 'DM Sans, sans-serif', marginBottom: 24, fontWeight: 600,
            }}>
                {tier.includedStorageGb} GB included
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {tier.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Check size={15} style={{ color: '#9945FF', flexShrink: 0, marginTop: 1 }} />
                        <span style={{
                            fontSize: 13.5, color: 'rgba(255,255,255,0.65)',
                            fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5,
                        }}>
                            {f}
                        </span>
                    </div>
                ))}
            </div>

            <button style={{
                width: '100%', padding: '12px', borderRadius: 12,
                background: tier.recommended
                    ? 'linear-gradient(135deg,#9945FF,#7233cc)'
                    : 'rgba(255,255,255,0.06)',
                border: tier.recommended ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
            }}>
                {tier.monthlyPriceUsd === 0 ? 'Start free' : `Choose ${tier.name}`}
            </button>
        </div>
    )
}

// ── Usage overage rate — fetched from backend, not hardcoded ───────────────
function UsageRateStrip() {
    const [ratePerGb, setRatePerGb] = useState<number | null>(null)

    useEffect(() => {
        // Backend doesn't currently expose a dedicated rate endpoint —
        // this derives the monthly rate from the billing constants indirectly.
        // See note below on adding a proper /api/billing/rate endpoint.
        fetch(`${API_URL}/api/billing/rate`)
            .then(res => res.json())
            .then(data => setRatePerGb(data.retailPerGbMonth))
            .catch(() => setRatePerGb(null))
    }, [])

    return (
        <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
        }}>
            <div>
                <p style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'DM Sans, sans-serif', marginBottom: 4,
                }}>
                    Usage-based overage pricing
                </p>
                <p style={{
                    fontSize: 14, color: 'rgba(255,255,255,0.65)',
                    fontFamily: 'DM Sans, sans-serif', maxWidth: 420, lineHeight: 1.6,
                }}>
                    You only pay after exceeding your tier's included storage.
                    No egress fees, ever.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 32, color: '#fff', letterSpacing: '-1px',
                }}>
                    {ratePerGb !== null ? `$${ratePerGb.toFixed(2)}` : '—'}
                </span>
                <span style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'DM Sans, sans-serif',
                }}>
                    per GB / month
                </span>
            </div>
        </div>
    )
}