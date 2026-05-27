import {
  Cloud,
  Wallet,
  Zap,
  ShieldCheck,
  Database,
  Globe,
} from 'lucide-react'

import { motion } from 'framer-motion'

const features = [
  {
    icon: Cloud,
    title: 'Instant R2 Provisioning',
    description:
      'Create production-grade Cloudflare R2 buckets instantly.',
    button: 'Deploy',
    cardBg: 'bg-emerald-950/40',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-300',
    shadow: 'shadow-emerald-950/40',
  },

  {
    icon: Wallet,
    title: 'Pay with SOL',
    description:
      'No credit cards or banking friction required.',
    button: 'Connect',

    cardBg: 'bg-blue-950/40',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-300',
    shadow: 'shadow-blue-950/40',
  },

  {
    icon: Zap,
    title: 'Ultra Fast Finality',
    description: 'Transactions finalize in under 400ms.',
    button: 'Launch',

    cardBg: 'bg-orange-950/40',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-300',
    shadow: 'shadow-orange-950/40',
  },

  {
    icon: ShieldCheck,
    title: 'Secure Infrastructure',
    description:
      'Enterprise-grade security and reliability.',
    button: 'Secure',

    cardBg: 'bg-slate-900/70',
    border: 'border-slate-500/20',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-200',
    shadow: 'shadow-black/40',
  },

  {
    icon: Database,
    title: 'Zero Egress Fees',
    description:
      'No hidden charges or surprise bandwidth costs.',
    button: 'Storage',

    cardBg: 'bg-zinc-900',
    border: 'border-zinc-700/40',
    iconBg: 'bg-zinc-700/20',
    iconColor: 'text-zinc-200',
    shadow: 'shadow-black/50',
  },

  {
    icon: Globe,
    title: 'Built for Global Devs',
    description:
      'Perfect for startups and indie hackers.',
    button: 'Explore',

    cardBg: 'bg-neutral-900',
    border: 'border-neutral-600/30',
    iconBg: 'bg-neutral-500/10',
    iconColor: 'text-neutral-200',
    shadow: 'shadow-neutral-950/40',
  },
]

const Features = () => {
  return (
    <section className='relative min-h-screen overflow-hidden px-6 py-24 text-white'>

      <div className='mx-auto max-w-7xl'>

        {/* Heading */}
        <div className='mx-auto mb-14 max-w-3xl text-center'>
          <h2 className='text-3xl font-black tracking-tight text-white md:text-2xl'>
            Everything You Need
            <br />
            to Deploy Faster
          </h2>

          <p className='mt-5 text-lg leading-relaxed text-zinc-500'>
            Modern infrastructure tooling designed for developers.
          </p>
        </div>

        {/* Draggable Cards Area */}
        <div className='relative flex min-h-[620px] flex-wrap items-start justify-center gap-6 overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] p-8'>
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                drag
                dragConstraints={{
                  left: -40,
                  right: 40,
                  top: -40,
                  bottom: 20,
                }}
                whileDrag={{
                  scale: 1.04,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className={`
                        relative h-[290px] w-[260px]
                        overflow-hidden rounded-[38px]
                        border backdrop-blur-xl
                        ${feature.cardBg}
                       ${feature.border}
                        shadow-2xl ${feature.shadow}
`}
              >

                {/* Inner */}
                <div className='flex h-full flex-col justify-between p-6'>

                  {/* Top */}
                  <div>
                    {/* Icon */}
                    <div
                      className={`
    mb-7 flex h-12 w-12 items-center
    justify-center rounded-2xl
    ${feature.iconBg}
  `}
                    >
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className='text-2xl font-bold leading-tight text-white'>
                      {feature.title}
                    </h3>

                    {/* Desc */}
                    <p className='mt-4 text-sm leading-relaxed text-zinc-500'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features