import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

import {
  Database,
  ShieldCheck,
  Wallet,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'

gsap.registerPlugin(SplitText)

const floatingCards = [
  {
    icon: Database,
    title: 'Storage Active',
    value: '12.4 TB',
    position:
      'top-[12%] left-[4%] rotate-[-8deg]',
  },

  {
    icon: Wallet,
    title: 'SOL Payment',
    value: 'Confirmed',
    position:
      'top-[18%] right-[5%] rotate-[8deg]',
  },

  {
    icon: ShieldCheck,
    title: 'Global Edge',
    value: '99.99%',
    position:
      'bottom-[18%] left-[10%] rotate-[-6deg]',
  },
]

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Split Main Title
      const heroSplit = new SplitText('.hero-title', {
        type: 'chars, words',
      })

      // Gradient per char
      heroSplit.chars.forEach((char) => {
        char.classList.add(
          'bg-gradient-to-b',
          'from-white',
          'via-zinc-200',
          'to-zinc-500',
          'bg-clip-text',
          'text-transparent'
        )
      })

      // Subtitle Split
      const subSplit = new SplitText('.hero-subtitle', {
        type: 'lines, words',
      })

      // Heading Animation
      gsap.from(heroSplit.chars, {
        y: 120,
        opacity: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: 'expo.out',
      })

      // Subtitle Animation
      gsap.from(subSplit.lines, {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        delay: 0.5,
        ease: 'power4.out',
      })

      // Buttons
      gsap.from('.hero-btn', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out',
      })

      // Floating Cards
      gsap.from('.floating-card', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        delay: 0.9,
        ease: 'power4.out',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className='relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-white'
    >

      {/* Background */}
      <div className='absolute inset-0 bg-black' />

      {/* Grid */}
      <div className='absolute inset-0 opacity-[0.03]'>
        <div className='h-full w-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:90px_90px]' />
      </div>

      {/* Purple Glow */}
      <div className='absolute top-[-120px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl' />

      {/* Huge Background Text */}
      <div className='pointer-events-none absolute bottom-[-100px] left-1/2 -translate-x-1/2 select-none text-[260px] font-black tracking-tight text-white/[0.03]'>
        SOLSTORE
      </div>

      {/* Floating Cards */}
      {floatingCards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={index}
            drag
            dragElastic={0.12}
            whileDrag={{
              scale: 1.1,
            }}
            dragConstraints={{
              top: 30,
              left: 40,
              right: 80,
              bottom: 50
            }}
            className={`floating-card absolute hidden w-[240px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl lg:block ${card.position}`}
          >
            <div className='flex items-center gap-4'>

              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04]'>
                <Icon className='h-5 w-5 text-zinc-200' />
              </div>

              <div>
                <p className='text-sm text-zinc-500'>
                  {card.title}
                </p>

                <h3 className='mt-1 text-lg font-bold text-white'>
                  {card.value}
                </h3>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Main Content */}
      <div className='relative z-10 mx-auto max-w-5xl text-center'>
        {/* Heading */}
        <h1
          className='hero-title font-black leading-none tracking-[-0.06em]'
          style={{
            fontSize: 'clamp(58px, 9vw, 110px)',
          }}
        >
          Cloud storage.
          <br />
          No card required.
        </h1>

        {/* Subtitle */}
        <p className='hero-subtitle mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-500 md:text-xl'>
          Pay with SOL. Get instant access to production-grade
          Cloudflare R2 storage with zero friction and zero nonsense.
        </p>

        {/* Buttons */}
        <div className='mt-12 flex flex-wrap items-center justify-center gap-4'>

          <Link
            to='/register'
            className='hero-btn group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.03]'
          >
            Get started free

            <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
          </Link>

          <Link
            to='/login'
            className='hero-btn rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]'
          >
            Log in
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className='mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500'>
          <span>Powered by Cloudflare R2</span>
          <span className='h-1 w-1 rounded-full bg-zinc-700' />
          <span>Solana Payments</span>
          <span className='h-1 w-1 rounded-full bg-zinc-700' />
          <span>Global Edge Network</span>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className='mt-20 flex flex-col items-center justify-center text-zinc-500'
        >
          <span className='mb-2 text-xs uppercase tracking-[0.25em]'>
            Scroll
          </span>

          <ChevronDown className='h-5 w-5' />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero