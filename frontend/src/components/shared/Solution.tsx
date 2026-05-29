import { useEffect, useRef } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { SplitText } from 'gsap/SplitText'

import {
    Cloud,
    ShieldCheck,
    Database,
    Zap,
    ArrowRight,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const companies = [
    {
        icon: Cloud,
        name: 'Instant Setup',
        description:
            'Deploy Cloudflare R2 buckets instantly with seamless Solana payments.',
    },

    {
        icon: ShieldCheck,
        name: 'Secure Infrastructure',
        description:
            'Enterprise-grade security and globally distributed cloud reliability.',
    },

    {
        icon: Database,
        name: 'Zero Egress Fees',
        description:
            'Scale storage without hidden bandwidth charges or surprise costs.',
    },

    {
        icon: Zap,
        name: 'Lightning Fast',
        description:
            'Built on Solana for ultra-fast confirmations and modern developer workflows.',
    },
]

const Solution = () => {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split Heading
            const headingSplit = new SplitText('.trusted-title', {
                type: 'chars, words',
            })

            headingSplit.chars.forEach((char) => {
                char.classList.add(
                    'bg-gradient-to-b',
                    'from-white',
                    'via-zinc-200',
                    'to-zinc-500',
                    'bg-clip-text',
                    'text-transparent'
                )
            })

            // Subtitle
            const subSplit = new SplitText('.trusted-subtitle', {
                type: 'chars, words',
            })

            // Heading Animation
            gsap.from(headingSplit.chars, {
                y: 100,
                opacity: 0,
                stagger: 0.035,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.trusted-title',
                    start: 'top 85%',
                },
            })

            // Subtitle Animation
            gsap.from(subSplit.chars, {
                y: 60,
                opacity: 0,
                stagger: 0.01,
                duration: 0.8,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '.trusted-subtitle',
                    start: 'top 90%',
                },
            })

            // Spotlight Glow
            const all = document.querySelectorAll('.spotlight-card')

            const handleMouseMove = (ev: MouseEvent) => {
                all.forEach((e) => {
                    const blob = e.querySelector('.blob') as HTMLElement
                    const fblob = e.querySelector('.fake-blob') as HTMLElement

                    if (!blob || !fblob) return

                    const rec = fblob.getBoundingClientRect()

                    blob.style.opacity = '1'

                    blob.animate(
                        [
                            {
                                transform: `translate(
                  ${ev.clientX - rec.left - rec.width / 2}px,
                  ${ev.clientY - rec.top - rec.height / 2}px
                )`,
                            },
                        ],
                        {
                            duration: 300,
                            fill: 'forwards',
                        }
                    )
                })
            }

            window.addEventListener('mousemove', handleMouseMove)

            return () => {
                window.removeEventListener(
                    'mousemove',
                    handleMouseMove
                )
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className='landing-bg relative min-h-screen overflow-hidden bg-black px-6 pt-24 pb-20 text-white'
        >
            <div className='relative z-10 mx-auto max-w-7xl'>
                {/* Heading */}
                <div className='mx-auto max-w-5xl text-center'>
                    <h2 className='trusted-title text-4xl font-black leading-none tracking-tight md:text-5xl font-serif'>
                        The Smarter Cloud Solution
                    </h2>

                    <p className='trusted-subtitle mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500'>
                        Deploy scalable Cloudflare R2 infrastructure instantly with seamless Solana payments and zero friction onboarding.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className='mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                    {companies.map((company, index) => {
                        const Icon = company.icon

                        return (
                            <div
                                key={index}
                                className='spotlight-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-[1px]'
                            >
                                {/* Glow */}
                                <div className='blob absolute top-0 left-0 z-0 size-40 rounded-full bg-white/20 opacity-0 blur-3xl transition-all duration-300' />

                                <div className='fake-blob absolute top-0 left-0 z-0 size-40 rounded-full' />

                                {/* Card */}
                                <div className='relative z-10 h-full overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-7 backdrop-blur-2xl transition-all duration-300 group-hover:bg-black/70'>

                                    {/* Texture */}
                                    <div className='absolute inset-0 opacity-[0.05] mix-blend-screen'>
                                        <div className='h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:8px_8px]' />
                                    </div>

                                    {/* Content */}
                                    <div className='relative z-10'>

                                        {/* Top */}
                                        <div className='mb-7 flex items-center gap-4'>

                                            <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]'>
                                                <Icon className='h-6 w-6 text-zinc-100' />
                                            </div>

                                            <div>
                                                <p className='text-sm uppercase tracking-[0.22em] text-zinc-500'>
                                                    Step 0{index + 1}
                                                </p>

                                                <h3 className='mt-1 text-2xl font-bold tracking-tight text-white'>
                                                    {company.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className='text-sm leading-relaxed text-zinc-400'>
                                            {company.description}
                                        </p>

                                        {/* Divider */}
                                        <div className='my-7 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent' />

                                        {/* Points */}
                                        <div className='space-y-4'>

                                            <div className='flex items-start gap-3'>
                                                <div className='mt-1.5 h-2 w-2 rounded-full bg-white/70' />
                                                <p className='text-sm text-zinc-300'>
                                                    Instant infrastructure provisioning
                                                </p>
                                            </div>

                                            <div className='flex items-start gap-3'>
                                                <div className='mt-1.5 h-2 w-2 rounded-full bg-white/70' />
                                                <p className='text-sm text-zinc-300'>
                                                    Modern developer-first experience
                                                </p>
                                            </div>

                                            <div className='flex items-start gap-3'>
                                                <div className='mt-1.5 h-2 w-2 rounded-full bg-white/70' />
                                                <p className='text-sm text-zinc-300'>
                                                    Built for scalable production apps
                                                </p>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className='mt-8 flex items-center gap-2 text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white'>

                                            <span className='text-sm font-medium'>
                                                Learn More
                                            </span>

                                            <ArrowRight className='h-4 w-4' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Solution