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
    position: 'top-[18%] left-[2%] rotate-[-8deg]',
  },

  {
    icon: Wallet,
    title: 'SOL Payment',
    value: 'Confirmed',
    position: 'top-[22%] right-[2%] rotate-[8deg]',
  },

  {
    icon: ShieldCheck,
    title: 'Global Edge',
    value: '99.99%',
    position: 'bottom-[18%] left-[8%] rotate-[-6deg]',
  },
]

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroSplit = new SplitText('.hero-title', {
        type: 'chars, words',
      })

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

      const subSplit = new SplitText('.hero-subtitle', {
        type: 'lines, words',
      })

      gsap.from(heroSplit.chars, {
        y: 120,
        opacity: 0,
        stagger: 0.03,
        duration: 1.2,
        ease: 'expo.out',
      })

      gsap.from(subSplit.lines, {
        y: 80,
        opacity: 0,
        stagger: 0.08,
        duration: 1,
        delay: 0.5,
        ease: 'power4.out',
      })

      gsap.from('.hero-btn', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.floating-card', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        delay: 1,
        ease: 'power4.out',
      })

      gsap.from('.hero-stat', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        delay: 1.1,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className='relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 text-white'
    >
      {/* Background */}
      <div className='absolute inset-0 bg-black' />

      {/* Grid */}
      <div className='absolute inset-0 opacity-[0.03]'>
        <div className='h-full w-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:85px_85px]' />
      </div>

      {/* Distributed Glow */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-[5%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-[180px]' />

        <div className='absolute left-[15%] top-[35%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[140px]' />

        <div className='absolute right-[15%] top-[30%] h-[350px] w-[350px] rounded-full bg-violet-500/5 blur-[120px]' />
      </div>

      {/* Floating Cards */}
      {floatingCards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={index}
            drag
            dragElastic={0.12}
            whileDrag={{ scale: 1.08 }}
            className={`floating-card absolute hidden w-[200px] overflow-hidden rounded-[28px] border border-white/10 bg-black/60 p-5 backdrop-blur-xl lg:block ${card.position}`}
          >
            <div className='flex items-center gap-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]'>
                <Icon className='h-5 w-5 text-zinc-200' />
              </div>

              <div>
                <p className='text-sm text-zinc-500'>
                  {card.title}
                </p>

                <h3 className='mt-1 text-xl font-bold text-white'>
                  {card.value}
                </h3>
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Main Content */}
      <div className='relative z-10 mx-auto mt-10 max-w-6xl text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 max-w-5xl text-center text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl lg:text-[92px]"
        >
          Cloud Storage
          <br />

          <span className="text-white/90">
            for the Solana Era.
          </span>
        </motion.h1>

        <p className='hero-subtitle mx-auto mt-10 max-w-3xl text-xl leading-relaxed text-zinc-500'>
          Pay with SOL. Get instant access to production-grade
          Cloudflare R2 storage with zero friction,
          zero banking headaches, and instant provisioning.
        </p>

        {/* CTA */}
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

        {/* Stats */}
        <div className='mt-14 flex flex-wrap items-center justify-center gap-12'>
          <div className='hero-stat'>
            <p className='text-4xl font-black text-white'>
              10GB
            </p>
            <p className='mt-2 text-sm text-zinc-500'>
              Free Storage
            </p>
          </div>

          <div className='hero-stat'>
            <p className='text-4xl font-black text-white'>
              &lt;60s
            </p>
            <p className='mt-2 text-sm text-zinc-500'>
              Provision Time
            </p>
          </div>

          <div className='hero-stat'>
            <p className='text-4xl font-black text-white'>
              $0
            </p>
            <p className='mt-2 text-sm text-zinc-500'>
              Egress Fees
            </p>
          </div>
        </div>

        {/* Trust Strip */}
        <div className='mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500'>
          <span>Powered by Cloudflare R2</span>

          <span className='h-1 w-1 rounded-full bg-zinc-700' />

          <span>Solana Payments</span>

          <span className='h-1 w-1 rounded-full bg-zinc-700' />

          <span>Global Edge Network</span>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className='mt-20 flex flex-col items-center justify-center text-zinc-500'
        >
          <span className='mb-2 text-xs uppercase tracking-[0.3em]'>
            Scroll
          </span>

          <ChevronDown className='h-5 w-5' />
        </motion.div>
      </div>

      {/* PLANET HORIZON */}
      <motion.div
        animate={{
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="pointer-events-none absolute bottom-[-380px] left-1/2 h-[700px] w-[200vw] -translate-x-1/2 rounded-[100%]"
        style={{
          boxShadow: `
            0 0 35px rgba(255,255,255,0.4),
            0 0 90px rgba(153,69,255,0.35),
            0 0 140px rgba(20,241,149,0.15)
          `,
          borderTop: "2px solid rgba(255,255,255,.55)",
        }}
      />

      {/* VIGNETTE */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,.75) 100%)",
        }}
      />
    </section>
  )
}

export default Hero