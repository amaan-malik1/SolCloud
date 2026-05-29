import {
  Cloud,
  Wallet,
  Zap,
  ShieldCheck,
  Database,
  Globe,
} from 'lucide-react'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'

const features = [
  {
    icon: Cloud,
    title: 'Instant R2 Provisioning',
    description:
      'Create production-grade Cloudflare R2 buckets instantly.',

    cardBg:
      'bg-gradient-to-br from-emerald-500/20 via-black to-black',

    border: 'border-emerald-400/30',

    iconBg:
      'bg-emerald-400/10 border border-emerald-400/20',

    iconColor: 'text-emerald-300',

    glow: 'bg-emerald-400/20',
  },

  {
    icon: Wallet,
    title: 'Pay with SOL',
    description:
      'No credit cards or banking friction required.',

    cardBg:
      'bg-gradient-to-br from-yellow-400/20 via-orange-500/10 to-black',

    border: 'border-yellow-400/30',

    iconBg:
      'bg-yellow-400/10 border border-yellow-400/20',

    iconColor: 'text-yellow-200',

    glow: 'bg-yellow-400/20',
  },

  {
    icon: Zap,
    title: 'Ultra Fast Finality',
    description:
      'Transactions finalize in under 400ms.',

    cardBg:
      'bg-gradient-to-br from-orange-500/20 via-red-500/10 to-black',

    border: 'border-orange-400/30',

    iconBg:
      'bg-orange-400/10 border border-orange-400/20',

    iconColor: 'text-orange-300',

    glow: 'bg-orange-400/20',
  },

  {
    icon: ShieldCheck,
    title: 'Secure Infrastructure',
    description:
      'Enterprise-grade security and reliability.',

    cardBg:
      'bg-gradient-to-br from-slate-400/10 via-zinc-800 to-black',

    border: 'border-slate-300/20',

    iconBg:
      'bg-slate-300/10 border border-slate-300/20',

    iconColor: 'text-slate-200',

    glow: 'bg-slate-300/10',
  },

  {
    icon: Database,
    title: 'Zero Egress Fees',
    description:
      'No hidden charges or surprise bandwidth costs.',

    cardBg:
      'bg-gradient-to-br from-zinc-200/10 via-zinc-800 to-black',

    border: 'border-zinc-300/20',

    iconBg:
      'bg-zinc-200/10 border border-zinc-200/20',

    iconColor: 'text-zinc-100',

    glow: 'bg-zinc-200/10',
  },

  {
    icon: Globe,
    title: 'Built for Global Devs',
    description:
      'Perfect for startups and indie hackers.',

    cardBg:
      'bg-gradient-to-br from-lime-400/20 via-black to-black',

    border: 'border-lime-300/30',

    iconBg:
      'bg-lime-300/10 border border-lime-300/20',

    iconColor: 'text-lime-200',

    glow: 'bg-lime-300/20',
  },
]

const WhySolStore = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main heading split
      const splitHeading = new SplitText(
        '.main-heading',
        {
          type: 'chars, words',
        }
      )

      splitHeading.chars.forEach((char) => {
        char.classList.add(
          'bg-gradient-to-b',
          'from-white',
          'via-zinc-200',
          'to-zinc-500',
          'bg-clip-text',
          'text-transparent'
        )
      })

      gsap.from(splitHeading.chars, {
        y: 100,
        opacity: 0,
        stagger: 0.035,
        duration: 1.2,
        ease: 'expo.out',

        scrollTrigger: {
          trigger: '.main-heading',
          start: 'top 85%',
        },
      })

      // Sub heading
      const splitSubHeading = new SplitText(
        '.sub-heading',
        {
          type: 'chars, words',
        }
      )

      gsap.from(splitSubHeading.chars, {
        y: 90,
        opacity: 0,
        stagger: 0.01,
        duration: 1,
        ease: 'power4.out',

        scrollTrigger: {
          trigger: '.sub-heading',
          start: 'top 90%',
        },
      })

      // Badge title
      const splitFeatureTitle = new SplitText(
        '.feature-title',
        {
          type: 'chars, words',
        }
      )

      splitFeatureTitle.chars.forEach((char) => {
        char.classList.add(
          'bg-gradient-to-r',
          'from-yellow-300',
          'via-orange-400',
          'to-orange-600',
          'bg-clip-text',
          'text-transparent'
        )
      })

      gsap.from(splitFeatureTitle.chars, {
        x: -100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.03,
        ease: 'expo.out',

        scrollTrigger: {
          trigger: '.feature-title',
          start: 'top 90%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className='relative min-h-screen overflow-hidden bg-black px-6 py-24 text-white'
      ref={sectionRef}
    >
      {/* Global Background Texture */}
      <div className='absolute inset-0 opacity-[0.04]'>
        <div className='h-full w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]' />
      </div>

      {/* Ambient Glow */}
      {/* <div className='absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]' /> */}

      <div className='relative mx-auto max-w-7xl'>
        {/* Badge */}
        <div className='flex items-center justify-center py-4'>
          <h2 className='feature-title rounded-full border border-orange-500/30 bg-white/[0.02] px-5 py-2 text-center text-sm tracking-wide backdrop-blur-xl'>
            Why SolStore
          </h2>
        </div>

        {/* Heading */}
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='main-heading font-serif text-4xl font-black tracking-tight text-white md:text-4xl'>
            Everything You Need
            <br />
            to Deploy Faster
          </h2>

          {/* <p className='sub-heading mt-6 text-lg leading-relaxed text-zinc-500'>
            Modern infrastructure tooling designed
            for developers who want speed,
            simplicity, and beautiful cloud
            infrastructure.
          </p> */}
        </div>

        {/* Cards */}
        <div className='relative flex min-h-[680px] flex-wrap items-start justify-center gap-7 overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl'>
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
                  y: -6,
                  scale: 1.02,
                }}
                className={`
                  group relative h-[300px] w-[270px]
                  overflow-hidden rounded-[36px]
                  border backdrop-blur-2xl
                  ${feature.cardBg}
                  ${feature.border}
                `}
              >
                {/* Card Glow */}
                <div
                  className={`absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${feature.glow}`}
                />

                {/* Texture */}
                <div className='absolute inset-0 opacity-[0.05]'>
                  <div className='h-full w-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:18px_18px]' />
                </div>

                {/* Gradient Border Top */}
                <div className='absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent' />

                {/* Content */}
                <div className='relative z-10 flex h-full flex-col justify-between p-7'>
                  {/* Top */}
                  <div>
                    {/* Icon */}
                    <div
                      className={`
                        mb-7 flex h-14 w-14
                        items-center justify-center
                        rounded-2xl backdrop-blur-xl
                        ${feature.iconBg}
                      `}
                    >
                      <Icon
                        className={`h-6 w-6 ${feature.iconColor}`}
                      />
                    </div>

                    {/* Title */}
                    <h3 className='text-3xl font-black leading-tight tracking-tight text-white'>
                      {feature.title}
                    </h3>

                    {/* Desc */}
                    <p className='mt-5 text-[15px] leading-relaxed text-zinc-400'>
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className='flex items-center justify-between'>
                    <div className='h-[5px] w-20 rounded-full bg-white/10'>
                      <div className='h-full w-10 rounded-full bg-white/40' />
                    </div>

                    <span className='text-xs font-semibold tracking-[0.3em] text-zinc-600'>
                      0{index + 1}
                    </span>
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

export default WhySolStore