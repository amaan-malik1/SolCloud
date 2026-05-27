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

    cardBg: 'bg-yellow-500/30',
    border: 'border-yellow-500/20',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-300',
    shadow: 'shadow-blue-950/40',
  },

  {
    icon: Zap,
    title: 'Ultra Fast Finality',
    description: 'Transactions finalize in under 400ms.',
    button: 'Launch',

    cardBg: 'bg-red-950/20',
    border: 'border-red-500/20',
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

    cardBg: 'bg-orange-950/40',
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

    cardBg: 'bg-black',
    border: 'border-neutral-600/30',
    iconBg: 'bg-neutral-500/10',
    iconColor: 'text-neutral-200',
    shadow: 'shadow-neutral-950/40',
  },
]


const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(
    () => {
      const ctx = gsap.context(() => {
        // split heading
        const splitHeading = new SplitText('.main-heading', { type: 'chars, words' })

        //heading char animation
        splitHeading.chars.forEach((char) => {
          char.classList.add(
            'bg-gradient-to-b',
            'from-white',
            'via-zinc-200',
            'to-zinc-500',
            'bg-clip-text',
            'text-transparent'
          )
        });

        // heading animation
        gsap.from(splitHeading.chars, {
          y: 100,
          opacity: 0,
          stagger: 0.035,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.main-heading',
            start: 'top 85%'
          }
        })

        // sub heading splitting
        const splitSubHeading = new SplitText('.sub-heading', {
          type: 'chars, words'
        });

        //sub heading animation
        gsap.from(splitSubHeading.chars, {
          y: 90,
          opacity: 0,
          stagger: 0.01,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.sub-heading',
            start: 'top 90%'
          }
        })

        //spliting title text
        const splitFeatureTitle = new SplitText('.feature-title', {
          type: 'chars, words'
        });

        //animation to chars
        splitFeatureTitle.chars.forEach((char) => {
          char.classList.add(
            'bg-gradient-to-r',
            'from-yellow-400',
            'to-orange-600',
            'bg-clip-text',
            'text-transparent'
          )
        })

        //aniimation for span feature title
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
    }, []
  )

  return (
    <section className='relative min-h-screen bg-black overflow-hidden px-6 py-24 text-white'
      ref={sectionRef}
    >

      <div className='mx-auto max-w-7xl'>

        {/* ticker Title */}
        <div className='flex items-center justify-center py-4'>
          <h2 className='feature-title rounded-full border border-b-orange-500/40 px-4 py-1 text-center font-body text-sm tracking-wide'>
            Why SolStore
          </h2>
        </div>

        {/* Heading */}
        <div className='mx-auto mb-14 max-w-3xl text-center'>
          <h2 className='main-heading text-3xl font-black tracking-tight text-white font-serif md:text-3xl'>
            Everything You Need
            <br />
            to Deploy Faster
          </h2>

          <p className='sub-heading mt-5 text-lg leading-relaxed text-zinc-500'>
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