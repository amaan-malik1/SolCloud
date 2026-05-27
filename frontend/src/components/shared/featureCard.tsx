'use client'

import React, { useEffect } from 'react'

interface FeatureCardProps {
    title?: string
    description?: string
    icon?: React.ReactNode
    className?: string
}

const FeatureCard = ({
    title = 'Hover for the Glow-Up',
    description = 'Glide your cursor here and watch magic unfold - an experience designed just for you.',
    className = ''
}: FeatureCardProps) => {
    useEffect(() => {
        const all = document.querySelectorAll('.spotlight-card')

        const handleMouseMove = (ev: MouseEvent) => {
            all.forEach(e => {
                const blob = e.querySelector('.blob') as HTMLElement
                const fblob = e.querySelector('.fake-blob') as HTMLElement

                if (!blob || !fblob) return

                const rec = fblob.getBoundingClientRect()

                blob.style.opacity = '1'

                blob.animate(
                    [
                        {
                            transform: `translate(${ev.clientX - rec.left - rec.width / 2
                                }px, ${ev.clientY - rec.top - rec.height / 2}px)`
                        }
                    ],
                    {
                        duration: 300,
                        fill: 'forwards'
                    }
                )
            })
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <div className={`h-max w-max ${className}`}>
            <div className='spotlight-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-[1px] transition-all duration-300 ease-in-out'>

                {/* Glow Blob */}
                <div className='blob absolute top-0 left-0 z-0 size-28 rounded-full bg-cyan-500/40 opacity-0 blur-3xl transition-all duration-300 ease-in-out' />
                <div className='fake-blob absolute top-0 left-0 z-0 size-28 rounded-full' />

                {/* Card */}
                <div className='relative z-10 max-w-80 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 group-hover:bg-black/60'>

                    <div className='mb-4 flex items-center gap-3'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='h-6 w-6 text-cyan-400'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 01-1.341-2.29L4.5 9.75l3.864-.846a4.5 4.5 0 012.29-1.341L12.75 6l.846 3.864a4.5 4.5 0 011.341 2.29L18 13.5l-2.096 1.813a4.5 4.5 0 01-2.29 1.341L9.75 18l.063-2.096z'
                                />
                            </svg>
                        </div>

                        <div>
                            <h3 className='text-xl font-semibold tracking-tight text-white'>
                                {title}
                            </h3>
                        </div>
                    </div>

                    <p className='text-sm leading-relaxed text-zinc-400'>
                        {description}
                    </p>

                    <div className='mt-6 flex items-center gap-2 text-cyan-400 transition-all duration-300 group-hover:translate-x-1'>
                        {/* <span className='text-sm font-medium'>Explore More</span> */}

                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='h-4 w-4'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureCard