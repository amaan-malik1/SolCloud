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
                        background: 'rgba(168,85,247,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontSize: 12, color: '#A855F7',
                        fontFamily: 'DM Sans, sans-serif', marginBottom: 20,
                    }}>
                        <Zap size={12} /> Pricing
                    </div>

                    <h2
                        style={{
                            fontFamily: 'Syne, sans-serif',
                            fontWeight: 600,
                            fontSize: 'clamp(42px, 8vw, 80px)',
                            lineHeight: 1,
                            letterSpacing: '-0.08em',
                            color: '#fff',
                            marginBottom: 20,
                        }}
                    >
                        Pricing that scales
                        <br />
                        with your storage.
                    </h2>

                    <p style={{
                        maxWidth: 560,
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.8,
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
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                border: tier.recommended
                    ? '1px solid rgba(168,85,247,0.28)'
                    : '1px solid rgba(255,255,255,0.06)',
                borderRadius: 28,
                padding: 36,
                backdropFilter: 'blur(20px)',
                minHeight: 520,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Glow */}
            {tier.recommended && (
                <div
                    style={{
                        position: 'absolute',
                        top: -120,
                        right: -120,
                        width: 260,
                        height: 260,
                        borderRadius: '50%',
                        background:
                            'radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Badge */}
            {tier.recommended && (
                <div
                    style={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(168,85,247,0.12)',
                        border: '1px solid rgba(168,85,247,0.25)',
                        color: '#A855F7',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'DM Sans, sans-serif',
                    }}
                >
                    Most Popular
                </div>
            )}

            {/* Plan Name */}
            <div
                style={{
                    fontSize: 13,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 20,
                    fontFamily: 'DM Sans, sans-serif',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {tier.name}
            </div>

            {/* Price */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    marginBottom: 8,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <span
                    style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: 64,
                        lineHeight: 1,
                        letterSpacing: '-0.08em',
                        color: '#fff',
                    }}
                >
                    ${tier.monthlyPriceUsd}
                </span>

                <span
                    style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.35)',
                        marginBottom: 10,
                        fontFamily: 'DM Sans, sans-serif',
                    }}
                >
                    /month
                </span>
            </div>

            {/* Storage */}
            <div
                style={{
                    color: '#A855F7',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 28,
                    fontFamily: 'DM Sans, sans-serif',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {tier.includedStorageGb} GB Included
            </div>

            {/* Divider */}
            <div
                style={{
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                    marginBottom: 28,
                }}
            />

            {/* Features */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    flex: 1,
                    marginBottom: 36,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {tier.features.map((feature) => (
                    <div
                        key={feature}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                        }}
                    >
                        <Check
                            size={14}
                            style={{
                                color: '#A855F7',
                                flexShrink: 0,
                                marginTop: 3,
                            }}
                        />

                        <span
                            style={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: 'rgba(255,255,255,0.72)',
                                fontFamily: 'DM Sans, sans-serif',
                            }}
                        >
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button
                style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: 16,
                    border: tier.recommended
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.08)',
                    background: tier.recommended
                        ? 'linear-gradient(135deg,#A855F7,#7C3AED,#5B21B6)'
                        : 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: tier.recommended
                        ? '0 12px 40px rgba(124,58,237,0.30)'
                        : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {tier.monthlyPriceUsd === 0
                    ? 'Start Free'
                    : `Choose ${tier.name}`}
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

    // const RETAIL_RATE = 0.020

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
                    {ratePerGb !== null ? `$${ratePerGb != null ? ratePerGb.toFixed(2) : '0.0200'}` : '—'}
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