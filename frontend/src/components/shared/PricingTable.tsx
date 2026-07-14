import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const EASE = [0.16, 1, 0.3, 1] as const

const included = [
  '10 GB storage included forever',
  'Dedicated Cloudflare R2 bucket',
  'S3-compatible credentials',
  'Zero egress fees, no bandwidth caps',
  'Billed daily from your SOL balance',
  'Top up any time, auto-reactivation',
]

const PricingSection = () => {
  return (
    <section id='pricing' className='relative overflow-hidden px-6 py-28 md:py-36'>
      <div className='pointer-events-none absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-accent/[0.05] blur-[150px]' />

      <div className='relative z-10 mx-auto max-w-6xl'>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className='max-w-2xl'
        >
          <h2 className='text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white'>
            One price.
            <span className='text-white/40'> No tiers to compare.</span>
          </h2>
          <p className='mt-5 max-w-xl text-lg leading-relaxed text-white/55'>
            Start free, then pay only for what you store past 10 GB. No
            subscription, no invoice, no surprise bandwidth line item.
          </p>
        </motion.div>

        <div className='mt-16 grid gap-4 lg:grid-cols-[1.2fr_1fr]'>
          {/* Price card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className='shell h-full'>
              <div className='shell-core relative flex h-full flex-col justify-between overflow-hidden p-8 sm:p-10'>
                <div className='pointer-events-none absolute right-[-20%] top-[-30%] h-72 w-72 rounded-full bg-accent/10 blur-[90px]' />

                <div className='relative'>
                  <p className='text-sm font-medium text-white/50'>
                    Usage-based, after your free 10 GB
                  </p>
                  <div className='mt-4 flex items-baseline gap-3'>
                    <span className='tabular text-6xl font-semibold tracking-[-0.03em] text-white sm:text-7xl'>
                      $0.02
                    </span>
                    <span className='text-lg text-white/45'>per GB / month</span>
                  </div>
                  <p className='mt-4 max-w-md text-[15px] leading-relaxed text-white/55'>
                    Deducted daily from your SOL balance at the live exchange
                    rate. Storing 100 GB costs about $1.80 a month beyond the
                    free tier.
                  </p>
                </div>

                <div className='relative mt-10'>
                  <Link
                    to='/register'
                    className='group inline-flex items-center gap-3 rounded-full bg-accent py-2.5 pl-7 pr-2.5 text-[15px] font-semibold text-accent-ink transition-all duration-500 ease-out-expo hover:shadow-[0_0_36px_rgba(52,211,153,0.4)] active:scale-[0.98]'
                  >
                    Create your bucket
                    <span className='flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink/15 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5'>
                      <ArrowUpRight className='h-4 w-4' />
                    </span>
                  </Link>
                  <p className='mt-4 text-sm text-white/40'>
                    No card required. Your first 10 GB never expires.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What's included */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          >
            <div className='shell h-full'>
              <div className='shell-core flex h-full flex-col p-8'>
                <h3 className='text-lg font-semibold tracking-tight text-white'>
                  Every account includes
                </h3>
                <ul className='mt-6 flex-1 space-y-4'>
                  {included.map((item) => (
                    <li key={item} className='flex items-start gap-3'>
                      <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10'>
                        <Check className='h-3 w-3 text-accent' />
                      </span>
                      <span className='text-[15px] leading-relaxed text-white/70'>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className='mt-8 border-t border-white/[0.07] pt-5'>
                  <p className='text-sm leading-relaxed text-white/40'>
                    Questions about volume pricing?{' '}
                    <a
                      href='https://x.com/amaaan_malik'
                      target='_blank'
                      rel='noreferrer'
                      className='text-accent/90 transition-colors duration-300 hover:text-accent'
                    >
                      Talk to us
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
