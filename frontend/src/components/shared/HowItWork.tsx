import { motion } from 'framer-motion'
import { Wallet, Radar, HardDrive, KeyRound } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const steps = [
  {
    icon: Wallet,
    title: 'Send SOL from your wallet',
    description:
      'Connect Phantom or Solflare and sign one transaction. Non-custodial, no card, no KYC — the memo field ties the payment to your account.',
    code: 'solstore:{userId}:v1',
    codeLabel: 'memo',
    stat: '~400 ms finality',
  },
  {
    icon: Radar,
    title: 'The indexer sees it land',
    description:
      'A webhook-driven indexer verifies the transaction on-chain and credits your balance, usually within a couple of seconds. Duplicates are impossible by design.',
    code: 'getSignaturesForAddress(wallet)',
    codeLabel: 'fallback poll',
    stat: '~2 s detection',
  },
  {
    icon: HardDrive,
    title: 'Your bucket is created',
    description:
      'A dedicated Cloudflare R2 bucket is provisioned with a scoped access token. Credentials are AES-256-GCM encrypted before storage.',
    code: 'cf.r2.tokens.create({ bucket })',
    codeLabel: 'provisioner',
    stat: '$0 egress',
  },
  {
    icon: KeyRound,
    title: 'Credentials appear in your dashboard',
    description:
      'Copy them into any S3-compatible SDK or tool and start uploading. Balance runs low? Top up with SOL and everything reactivates.',
    code: 'endpoint: r2.cloudflarestorage.com',
    codeLabel: 's3-compatible',
    stat: '10 GB free',
  },
]

const HowItWorks = () => {
  return (
    <section id='how-it-work' className='relative overflow-hidden px-6 py-28 text-white md:py-36'>
      {/* Single ambient glow */}
      <div className='pointer-events-none absolute left-[-15%] top-1/3 h-[500px] w-[500px] rounded-full bg-accent/[0.05] blur-[150px]' />

      <div className='relative mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20'>
        {/* Sticky intro column */}
        <div className='lg:sticky lg:top-32 lg:self-start'>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <h2 className='text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]'>
              From payment
              <br />
              <span className='text-white/40'>to PUT request.</span>
            </h2>
            <p className='mt-5 max-w-sm text-lg leading-relaxed text-white/55'>
              Four steps, no humans involved. The whole flow usually finishes
              before a bank would have even authorized a card.
            </p>
          </motion.div>
        </div>

        {/* Steps rail */}
        <ol className='relative mt-14 space-y-4 lg:mt-2'>
          {/* Connecting line */}
          <div
            aria-hidden
            className='absolute bottom-8 left-[27px] top-8 w-px bg-gradient-to-b from-accent/40 via-white/10 to-transparent'
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
                className='relative flex gap-6'
              >
                {/* Node */}
                <div className='relative z-10 mt-6 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-dark-surface shadow-[0_0_24px_rgba(52,211,153,0.12)]'>
                  <Icon className='h-5 w-5 text-accent' />
                </div>

                {/* Card */}
                <div className='group flex-1 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 ease-out-expo hover:border-accent/25 hover:bg-white/[0.04] sm:p-7'>
                  <div className='flex flex-wrap items-baseline justify-between gap-2'>
                    <h3 className='text-lg font-semibold tracking-tight sm:text-xl'>
                      <span className='tabular mr-3 font-mono text-sm text-white/30'>
                        0{index + 1}
                      </span>
                      {step.title}
                    </h3>
                    <span className='tabular rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1 font-mono text-xs text-accent'>
                      {step.stat}
                    </span>
                  </div>

                  <p className='mt-3 max-w-xl text-[15px] leading-relaxed text-white/55'>
                    {step.description}
                  </p>

                  <div className='mt-5 flex flex-wrap items-center gap-3 overflow-x-auto rounded-xl border border-white/[0.06] bg-black/35 px-4 py-3'>
                    <span className='shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/30'>
                      {step.codeLabel}
                    </span>
                    <code className='font-mono text-[12.5px] text-accent/90'>
                      {step.code}
                    </code>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
