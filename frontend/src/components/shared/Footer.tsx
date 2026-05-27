import React from 'react'
import { Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className='relative overflow-hidden bg-black text-white'>

            {/* Container */}
            <div className='relative z-10 mx-auto max-w-7xl px-10 pt-10 pb-52'>

                {/* Top Border */}
                <div className='mb-24 border-t border-white/10' />

                {/* Grid */}
                <div className='grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-5'>

                    {/* Brand */}
                    <div className='lg:col-span-2'>
                        <div className='mb-8 flex items-center gap-3'>

                            {/* Logo */}
                            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white'>
                                <span className='text-lg font-black text-black'>
                                    S
                                </span>
                            </div>

                            <h2 className='text-3xl font-bold tracking-tight'>
                                SolCloud
                            </h2>
                        </div>

                        <p className='max-w-sm text-[15px] leading-8 text-zinc-500'>
                            © copyright SolCloud 2026.
                            <br />
                            All rights reserved.
                        </p>
                    </div>

                    {/* Pages */}
                    <div>
                        <h3 className='mb-7 text-xl font-semibold'>
                            Pages
                        </h3>

                        <ul className='space-y-5 text-[17px] text-white'>
                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    All Products
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Studio
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Clients
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Pricing
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h3 className='mb-7 text-xl font-semibold'>
                            Socials
                        </h3>

                        <ul className='space-y-5 text-[17px] text-white'>
                            <li>
                                <a
                                    href='#'
                                    className='flex items-center gap-2 transition hover:text-zinc-400'
                                >
                                    Twitter
                                </a>
                            </li>

                            <li>
                                <a
                                    href='#'
                                    className='flex items-center gap-2 transition hover:text-zinc-400'
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className='mb-7 text-xl font-semibold'>
                            Legal
                        </h3>

                        <ul className='space-y-5 text-[17px] text-white'>
                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Privacy Policy
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Terms of Service
                                </a>
                            </li>

                            <li>
                                <a href='#' className='transition hover:text-zinc-400'>
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* BIG SolCloud in bg */}
            <div className='pointer-events-none absolute bottom-[-100px] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[220px] font-black leading-none tracking-tight text-white/[0.03] md:text-[340px]'>
                SolCloud
            </div>
        </footer>
    )
}

export default Footer