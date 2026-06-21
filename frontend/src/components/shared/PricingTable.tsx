import {
    HardDrive,
    Wallet,
    Globe,
    Shield,
    ArrowRight,
    Cloud,
    Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const bentoCards = [
    {
        icon: HardDrive,
        title: '10GB Free',
        description:
            'Every account includes 10GB of Cloudflare R2 storage at no cost.',
        size: 'large',
    },
    {
        icon: Globe,
        title: '$0 Egress',
        description:
            'No bandwidth fees. No surprise invoices. Ever.',
        size: 'small',
    },
    {
        icon: Wallet,
        title: 'Pay with SOL',
        description:
            'No credit cards. No banking restrictions.',
        size: 'small',
    },
    {
        icon: Cloud,
        title: 'Cloudflare R2',
        description:
            'Production-grade object storage with S3 compatibility.',
        size: 'wide',
    },
]

const PricingSection = () => {
    return (
        <section id='pricing' className="relative overflow-hidden px-6 py-32 bg-black">
            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mx-auto mb-24 max-w-4xl text-center">
                    <div className="mb-8 inline-flex items-center rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                        Pricing
                    </div>

                    <h2 className="font-display text-5xl tracking-[-0.06em] text-white md:text-8xl">
                        <span>
                            Start free.
                        </span>
                        <br />
                        <span className="text-white/40">
                            Scale when you need it.
                        </span>
                    </h2>
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-500">
                        No subscriptions. No hidden bandwidth fees.
                        Just simple usage-based pricing powered by Solana.
                    </p>
                </div>
                {/* Grid */}
                <div className="grid auto-rows-[240px] gap-6 md:grid-cols-4">
                    {/* Large */}
                    <div className="relative overflow-hidden rounded-[36px] border border-purple-500/20 bg-gradient-to-br from-[#140c22] via-[#0d0918] to-[#08080c] p-8 md:col-span-2">

                        {/* Glow */}
                        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-purple-500/10 blur-[120px]" />

                        {/* Noise texture */}
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                                backgroundSize: '14px 14px',
                            }}
                        />

                        <div className="relative z-10 flex h-full flex-col justify-between">

                            <div>
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10">
                                    <HardDrive className="h-6 w-6 text-purple-300" />
                                </div>

                                <h3 className="text-5xl md:text-6xl font-black tracking-[-0.08em] text-white">
                                    10GB
                                </h3>

                                <p className="mt-2 text-lg font-semibold text-purple-300">
                                    Free storage included
                                </p>

                                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                                    Every account starts with 10GB of Cloudflare R2 storage.
                                </p>
                            </div>
                            {/* 
                            <div className="border-t border-white/5 pt-4">
                                <span className="text-sm text-zinc-500">
                                    No credit card required
                                </span>
                            </div> */}

                        </div>

                    </div>

                    {/* Card */}
                    <div className="rounded-[36px] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-xl">

                        <Globe className="mb-6 h-7 w-7 text-purple-300" />

                        <div className="text-4xl font-black text-white">
                            $0
                        </div>

                        <div className="mt-2 text-lg font-semibold text-zinc-200">
                            Egress Fees
                        </div>

                        <p className="mt-4 text-sm text-zinc-500">
                            Download as much as you want.
                        </p>

                    </div>

                    {/* Card */}
                    <div className="rounded-[36px] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-xl">

                        <Wallet className="mb-6 h-7 w-7 text-purple-300" />

                        <div className="text-4xl font-black text-white">
                            SOL
                        </div>

                        <div className="mt-2 text-lg font-semibold text-zinc-200">
                            Native Payments
                        </div>

                        <p className="mt-4 text-sm text-zinc-500">
                            No cards. No banking friction.
                        </p>

                    </div>

                    {/* Wide Card */}
                    <div className="rounded-[36px] border border-white/5 bg-white/[0.03] p-8 backdrop-blur-xl md:col-span-2">

                        <Cloud className="mb-6 h-7 w-7 text-purple-300" />

                        <div className="text-3xl font-black text-white">
                            Cloudflare R2
                        </div>

                        <p className="mt-4 max-w-md text-zinc-500">
                            Production-ready object storage with
                            full S3 compatibility and instant provisioning.
                        </p>

                    </div>

                    {/* Pricing Card */}
                    <div className="relative overflow-hidden rounded-[36px] border border-purple-500/20 bg-gradient-to-b from-[#181226] to-[#0d0d12] p-8 md:col-span-2">

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,.15),transparent_70%)]" />

                        <div className="relative z-10">

                            <div className="mb-4 text-sm uppercase tracking-[0.3em] text-purple-300">
                                Usage Pricing
                            </div>

                            <div className="text-6xl font-black tracking-[-0.08em] text-white">
                                $0.02
                            </div>

                            <div className="mt-2 text-lg text-zinc-400">
                                per GB / month
                            </div>

                            <p className="mt-6 max-w-md text-zinc-500">
                                You only pay after exceeding your free 10GB tier.
                            </p>

                        </div>

                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="mt-32 text-center">

                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
                        <Zap size={14} />
                        Instant Provisioning
                    </div>

                    <h3 className="text-5xl font-black tracking-tight text-white">
                        Your first bucket
                        <br />
                        costs nothing.
                    </h3>

                    <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500">
                        Connect your wallet.
                        Send SOL.
                        Receive your R2 credentials instantly.
                    </p>

                    <Link
                        to="/register"
                        className="
              mt-10 inline-flex
              items-center gap-3
              rounded-2xl
              bg-gradient-to-r
              from-purple-500
              to-violet-600
              px-8 py-4
              font-semibold
              text-white
              shadow-[0_0_40px_rgba(168,85,247,0.35)]
              transition-all
              duration-300
              hover:scale-[1.02]
            "
                    >
                        Start Building

                        <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                </div>
            </div>
        </section>
    )
}

export default PricingSection