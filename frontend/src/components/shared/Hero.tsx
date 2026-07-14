import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import VaultScene from './VaultScene'

const EASE = [0.16, 1, 0.3, 1] as const

const stats = [
  { value: '10 GB', label: 'free storage' },
  { value: '<60 s', label: 'to provision' },
  { value: '$0', label: 'egress fees' },
]

const Hero = () => {
  return (
    <section className='relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-16 pt-32 text-white lg:pt-24'>
      {/* Ambient background: single mint glow + faint grid */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute right-[-10%] top-[-20%] h-[700px] w-[700px] rounded-full bg-accent/[0.07] blur-[160px]' />
        <div className='absolute bottom-[-30%] left-[-15%] h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[140px]' />
        <div className='grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]' />
      </div>

      <div className='relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8'>
        {/* Copy */}
        <div className='max-w-2xl'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className='inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5'
          >
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-accent' />
            </span>
            <span className='text-[13px] font-medium text-accent'>
              Live on Solana mainnet
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: EASE }}
            className='mt-7 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]'
          >
            Object storage
            <br />
            you pay for{' '}
            <span className='text-accent'>in SOL.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.18, ease: EASE }}
            className='mt-7 max-w-lg text-lg leading-relaxed text-white/60'
            style={{ textWrap: 'pretty' }}
          >
            SolStore provisions a dedicated Cloudflare R2 bucket the moment your
            Solana payment lands. S3-compatible credentials in under a minute —
            no card, no KYC, no egress bills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE }}
            className='mt-10 flex flex-wrap items-center gap-4'
          >
            <Link
              to='/register'
              className='group flex items-center gap-3 rounded-full bg-accent py-2.5 pl-7 pr-2.5 text-[15px] font-semibold text-accent-ink transition-all duration-500 ease-out-expo hover:shadow-[0_0_36px_rgba(52,211,153,0.4)] active:scale-[0.98]'
            >
              Start with 10 GB free
              <span className='flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink/15 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
                <ArrowUpRight className='h-4 w-4' />
              </span>
            </Link>

            <a
              href='#pricing'
              className='rounded-full border border-white/10 bg-white/[0.03] px-7 py-3 text-[15px] font-medium text-white/80 transition-all duration-500 ease-out-expo hover:border-white/25 hover:text-white active:scale-[0.98]'
            >
              See pricing
            </a>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className='mt-14 flex items-center gap-8 sm:gap-12'
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className='flex items-center gap-8 sm:gap-12'>
                {i > 0 && <span className='h-10 w-px bg-white/10' />}
                <div>
                  <dt className='sr-only'>{stat.label}</dt>
                  <dd className='tabular text-3xl font-semibold tracking-tight text-white'>
                    {stat.value}
                  </dd>
                  <p className='mt-1 text-sm text-white/45'>{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Interactive 3D vault */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className='hidden sm:block'
        >
          <VaultScene />
        </motion.div>
      </div>

      {/* Horizon line */}
      <div className='pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent' />
    </section>
  )
}

export default Hero
