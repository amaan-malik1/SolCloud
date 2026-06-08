import { useEffect, useRef } from 'react'
import {
    Wallet,
    Cpu,
    HardDrive,
    Key,
    Check,
    ArrowRight,
    ExternalLink,
} from 'lucide-react'

const steps = [
    {
        icon: Wallet,
        step: '01',
        title: 'Connect Wallet & Send SOL',
        description:
            'Connect Phantom or Solflare instantly. No credit cards, no KYC, no banking friction — just a secure Solana transaction in one click.',

        code: 'solstore:{userId}:v1',
        codeLabel: 'Memo field',

        accent: '#f97316',
        gradient:
            'linear-gradient(135deg, rgba(249,115,22,0.18), rgba(251,191,36,0.08))',
        glow: 'rgba(249,115,22,0.18)',

        features: [
            'Phantom & Solflare supported',
            'Fully non-custodial payments',
            'Instant blockchain confirmation',
        ],

        stat: {
            value: '<400ms',
            label: 'Solana finality',
        },
    },

    {
        icon: Cpu,
        step: '02',
        title: 'Indexer Detects Payment',
        description:
            'Our backend indexer continuously scans Solana transactions and instantly credits your account after payment verification.',

        code: 'getSignaturesForAddress(wallet)',
        codeLabel: 'Indexer method',

        accent: '#84cc16',
        gradient:
            'linear-gradient(135deg, rgba(132,204,22,0.16), rgba(255,255,255,0.04))',
        glow: 'rgba(132,204,22,0.15)',

        features: [
            'Scans chain every 2 seconds',
            'No duplicate payment issues',
            'Real-time SOL pricing',
        ],

        stat: {
            value: '~2s',
            label: 'Detection time',
        },
    },

    {
        icon: HardDrive,
        step: '03',
        title: 'R2 Bucket Provisioned',
        description:
            'Cloudflare R2 buckets and scoped access tokens are automatically provisioned and securely encrypted for your account.',

        code: 'cf.r2.tokens.create({ bucket })',
        codeLabel: 'Provisioner',

        accent: '#e5e7eb',
        gradient:
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(161,161,170,0.05))',
        glow: 'rgba(255,255,255,0.08)',

        features: [
            'Dedicated isolated storage',
            'AES-256 encrypted credentials',
            'Zero egress fee infrastructure',
        ],

        stat: {
            value: '$0',
            label: 'Egress fees',
        },
    },

    {
        icon: Key,
        step: '04',
        title: 'Use Your Storage',
        description:
            'Access credentials appear instantly in your dashboard and work seamlessly with AWS SDKs and existing S3 tooling.',

        code: 'endpoint: r2.cloudflarestorage.com',
        codeLabel: 'S3-compatible',

        accent: '#facc15',
        gradient:
            'linear-gradient(135deg, rgba(250,204,21,0.16), rgba(249,115,22,0.08))',
        glow: 'rgba(250,204,21,0.14)',

        features: [
            'Works with AWS SDK v3',
            '10 GB free storage tier',
            'Auto-reactivation on recharge',
        ],

        stat: {
            value: '10 GB',
            label: 'Free storage',
        },
    },
]

const HowItWorks = () => {
    const sectionRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const line = lineRef.current

        if (!line) return

        const onScroll = () => {
            const section = sectionRef.current

            if (!section) return

            const rect = section.getBoundingClientRect()

            const progress = Math.max(
                0,
                Math.min(
                    1,
                    -rect.top / (rect.height - window.innerHeight)
                )
            )

            line.style.height = `${progress * 100}%`
        }

        window.addEventListener('scroll', onScroll, {
            passive: true,
        })

        return () =>
            window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const handleMouseMove = (ev: MouseEvent) => {
            document
                .querySelectorAll('.how-card')
                .forEach((card) => {
                    const blob = card.querySelector(
                        '.blob'
                    ) as HTMLElement

                    const fakeBlob = card.querySelector(
                        '.fake-blob'
                    ) as HTMLElement

                    if (!blob || !fakeBlob) return

                    const rec =
                        fakeBlob.getBoundingClientRect()

                    blob.style.opacity = '1'

                    blob.animate(
                        [
                            {
                                transform: `translate(${ev.clientX -
                                    rec.left -
                                    rec.width / 2
                                    }px, ${ev.clientY -
                                    rec.top -
                                    rec.height / 2
                                    }px)`,
                            },
                        ],
                        {
                            duration: 300,
                            fill: 'forwards',
                        }
                    )
                })
        }

        window.addEventListener(
            'mousemove',
            handleMouseMove
        )

        return () =>
            window.removeEventListener(
                'mousemove',
                handleMouseMove
            )
    }, [])

    useEffect(() => {
        const cards =
            document.querySelectorAll(
                '.how-card-wrapper'
            )

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        ; (
                            e.target as HTMLElement
                        ).style.opacity = '1'

                            ; (
                                e.target as HTMLElement
                            ).style.transform =
                                'translateY(0)'

                        obs.unobserve(e.target)
                    }
                })
            },
            {
                threshold: 0.15,
            }
        )

        cards.forEach((c) => obs.observe(c))

        return () => obs.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            id='how-it-work'
            style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '120px 24px',
                background:
                    'black',
            }}
        >
            {/* Background Texture */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.04,
                    pointerEvents: 'none',

                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,

                    backgroundSize: '28px 28px',
                }}
            />

            <div
                style={{
                    maxWidth: 1120,
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 100,
                    }}
                >
                    <p
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            color: '#f97316',
                            marginBottom: 18,
                        }}
                    >
                        HOW IT WORKS
                    </p>

                    <h2
                        className='space-y-[-3] text-5xl'
                    >
                        Pay with SOL.
                        <br />

                        <span
                            style={{
                                background:
                                    'linear-gradient(to bottom, #fff, #71717a)',
                                WebkitBackgroundClip:
                                    'text',
                                WebkitTextFillColor:
                                    'transparent',
                            }}
                        >
                            Get storage instantly.
                        </span>
                    </h2>


                </div>

                {/* Timeline */}
                <div
                    style={{
                        position: 'relative',
                    }}
                >
                    {/* Timeline Line */}
                    <div
                        className='hidden-mobile-line'
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            bottom: 0,
                            width: 1,
                            transform:
                                'translateX(-50%)',
                            background:
                                'rgba(255,255,255,0.08)',
                        }}
                    />

                    {/* Animated Fill */}
                    <div
                        ref={lineRef}
                        className='hidden-mobile-line'
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: 0,
                            width: 2,
                            transform:
                                'translateX(-50%)',

                            background:
                                'linear-gradient(to bottom, #f97316, #facc15, #84cc16)',

                            height: '0%',
                            transition:
                                'height 0.1s linear',
                            zIndex: 1,
                        }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                        }}
                    >
                        {steps.map((step, index) => {
                            const Icon = step.icon

                            const isLeft =
                                index % 2 === 0

                            return (
                                <div
                                    key={index}
                                    className='how-card-wrapper'
                                    style={{
                                        display: 'flex',
                                        alignItems:
                                            'center',

                                        opacity: 0,
                                        transform:
                                            'translateY(40px)',

                                        transition: `all 0.7s ease ${index *
                                            120
                                            }ms`,

                                        marginBottom:
                                            index <
                                                steps.length - 1
                                                ? 40
                                                : 0,
                                    }}
                                >
                                    {/* Left */}
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            justifyContent:
                                                'flex-end',

                                            paddingRight: 48,

                                            visibility:
                                                isLeft
                                                    ? 'visible'
                                                    : 'hidden',
                                        }}
                                    >
                                        {isLeft && (
                                            <StepCard
                                                step={step}
                                                Icon={Icon}
                                            />
                                        )}
                                    </div>

                                    {/* Center Dot */}
                                    <div
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius:
                                                '50%',

                                            background: `${step.accent}15`,

                                            border: `1px solid ${step.accent}40`,

                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'center',

                                            flexShrink: 0,

                                            position:
                                                'relative',

                                            zIndex: 2,

                                            boxShadow: `0 0 25px ${step.glow}`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius:
                                                    '50%',
                                                background:
                                                    step.accent,
                                            }}
                                        />
                                    </div>

                                    {/* Right */}
                                    <div
                                        style={{
                                            flex: 1,
                                            paddingLeft: 48,

                                            visibility:
                                                !isLeft
                                                    ? 'visible'
                                                    : 'hidden',
                                        }}
                                    >
                                        {!isLeft && (
                                            <StepCard
                                                step={step}
                                                Icon={Icon}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile-line {
            display: none !important;
          }
        }
      `}</style>
        </section>
    )
}

function StepCard({
    step,
    Icon,
}: {
    step: typeof steps[0]
    Icon: any
}) {
    return (
        <div
            className='how-card'
            style={{
                position: 'relative',
                overflow: 'hidden',

                borderRadius: 28,

                border: `1px solid ${step.accent}25`,

                background: `
          ${step.gradient},
          rgba(10,10,14,0.92)
        `,

                backdropFilter: 'blur(18px)',

                boxShadow: `
          0 10px 40px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.04)
        `,

                maxWidth: 480,
                width: '100%',

                transition:
                    'border-color 0.3s, transform 0.3s, box-shadow 0.3s',

                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${step.accent}55`

                e.currentTarget.style.transform =
                    'translateY(-6px)'

                e.currentTarget.style.boxShadow = `
          0 20px 60px rgba(0,0,0,0.55),
          0 0 40px ${step.glow}
        `
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${step.accent}25`

                e.currentTarget.style.transform =
                    'translateY(0)'

                e.currentTarget.style.boxShadow = `
          0 10px 40px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.04)
        `
            }}
        >
            {/* Blob */}
            <div
                className='blob'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,

                    width: 180,
                    height: 180,
                    borderRadius: '50%',

                    background: step.glow,

                    opacity: 0,

                    filter: 'blur(55px)',

                    transition: 'opacity 0.3s',

                    pointerEvents: 'none',
                }}
            />

            <div
                className='fake-blob'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,

                    width: 180,
                    height: 180,

                    borderRadius: '50%',
                }}
            />

            {/* Grid Texture */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.045,
                    pointerEvents: 'none',

                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,

                    backgroundSize: '22px 22px',

                    maskImage:
                        'radial-gradient(circle at center, black, transparent 90%)',
                }}
            />

            {/* Accent Line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,

                    background: `linear-gradient(90deg, transparent, ${step.accent}70, transparent)`,
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '34px 34px 28px',
                }}
            >
                {/* Top */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',

                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,

                            background: `${step.accent}15`,

                            border: `1px solid ${step.accent}30`,

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:
                                'center',
                        }}
                    >
                        <Icon
                            size={22}
                            color={step.accent}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                padding: '4px 12px',
                                borderRadius: 999,

                                background: `${step.accent}12`,

                                border: `1px solid ${step.accent}25`,

                                fontSize: 12,
                                fontWeight: 700,
                                color: step.accent,
                            }}
                        >
                            {step.stat.value}
                        </div>

                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform:
                                    'uppercase',

                                color:
                                    'rgba(255,255,255,0.2)',
                            }}
                        >
                            STEP {step.step}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.2,
                        marginBottom: 14,
                    }}
                >
                    {step.title}
                </h3>

                {/* Desc */}
                <p
                    style={{
                        fontSize: 14,
                        color:
                            'rgba(255,255,255,0.45)',

                        lineHeight: 1.8,
                        marginBottom: 22,
                    }}
                >
                    {step.description}
                </p>

                {/* Code */}
                <div
                    style={{
                        padding: '12px 14px',
                        borderRadius: 12,

                        background:
                            'rgba(0,0,0,0.35)',

                        border:
                            '1px solid rgba(255,255,255,0.06)',

                        marginBottom: 22,

                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <span
                        style={{
                            fontSize: 10,
                            color:
                                'rgba(255,255,255,0.25)',
                        }}
                    >
                        {step.codeLabel}
                    </span>

                    <code
                        style={{
                            fontSize: 12,
                            color: step.accent,
                        }}
                    >
                        {step.code}
                    </code>
                </div>

                {/* Features */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        marginBottom: 22,
                    }}
                >
                    {step.features.map((f, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius:
                                        '50%',

                                    background: `${step.accent}15`,

                                    border: `1px solid ${step.accent}30`,

                                    display: 'flex',
                                    alignItems:
                                        'center',
                                    justifyContent:
                                        'center',
                                }}
                            >
                                <Check
                                    size={10}
                                    color={step.accent}
                                />
                            </div>

                            <span
                                style={{
                                    fontSize: 13,
                                    color:
                                        'rgba(255,255,255,0.55)',
                                }}
                            >
                                {f}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div
                    style={{
                        paddingTop: 18,

                        borderTop:
                            '1px solid rgba(255,255,255,0.06)',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:
                            'space-between',
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            color:
                                'rgba(255,255,255,0.3)',
                        }}
                    >
                        {step.stat.label}
                    </span>

                    <div
                        style={{
                            height: 2,
                            width: 90,

                            borderRadius: 999,

                            background: `linear-gradient(90deg, ${step.accent}, transparent)`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default HowItWorks