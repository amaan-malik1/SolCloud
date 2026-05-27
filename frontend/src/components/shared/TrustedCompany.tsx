import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { SplitText } from 'gsap/SplitText'

import {
    Cloud,
    ShieldCheck,
    Database,
    Zap,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, SplitText)

const companies = [
    {
        icon: Cloud,
        name: 'SolStore',
    },
    {
        icon: ShieldCheck,
        name: 'SecureEdge',
    },
    {
        icon: Database,
        name: 'R2 Storage',
    },
    {
        icon: Zap,
        name: 'Lightning API',
    },
]

const TrustedBy = () => {
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(
        () => {
            const ctx = gsap.context(() => {

                // Split Heading
                const headingSplit = new SplitText('.trusted-title', {
                    type: 'chars, words',
                })

                // Gradient per character
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

                // Split Subtitle
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

            }, sectionRef)

            return () => ctx.revert()
        }, []
    )

    return (
        <section
            ref={sectionRef}
            className='min-h-screen relative overflow-hidden px-6 pt-24 pb-16 text-white bg-black'
        >

            {/* Background Glow */}
            <div className='absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl' />

            <div className='relative z-10 mx-auto max-w-7xl'>

                {/* Heading */}
                <div className='mx-auto max-w-5xl text-center'>

                    <h2 className='trusted-title text-4xl font-black leading-none tracking-tight md:text-5xl'>
                        Trusted by the best companies
                    </h2>

                    <p className='trusted-subtitle mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500'>
                        Companies that have been using our product from the very start.
                    </p>
                </div>

                {/* Cards */}
                <div className='company-grid mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {companies.map((company, index) => {
                        const Icon = company.icon

                        return (
                            <div
                                key={index}
                                className='group relative overflow-hidden rounded-3xl border border-white/8 bg-zinc-900/70 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-zinc-900'
                            >
                                <div className='relative z-10 flex items-center gap-4'>

                                    {/* Icon */}
                                    <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black'>
                                        <Icon className='h-7 w-7 text-zinc-300 transition-all duration-300 group-hover:text-white' />
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className='text-xl font-semibold tracking-tight text-zinc-100'>
                                            {company.name}
                                        </h3>

                                        <p className='mt-1 text-sm text-zinc-500'>
                                            Trusted Infrastructure
                                        </p>
                                    </div>
                                </div>

                                {/* Subtle Hover Gradient */}
                                <div className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                                    <div className='absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent' />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default TrustedBy