import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Tilt } from './Tilt'

const EASE = [0.16, 1, 0.3, 1] as const

const provisionLog = [
  { text: 'payment received · 0.42 SOL', done: true },
  { text: 'verifying signature on-chain', done: true },
  { text: 'creating R2 bucket · solstore-8f2c', done: true },
  { text: 'scoping access token', done: true },
  { text: 'encrypting credentials · AES-256-GCM', done: false },
]

const WhySolStore = () => {
  return (
    <section
      id='why-solStore'
      className='relative overflow-hidden px-6 py-28 text-white md:py-36'
    >
      <div className='relative mx-auto max-w-6xl'>
        {/* Left-aligned header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className='max-w-2xl'
        >
          <h2 className='text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]'>
            Everything between your wallet
            <br className='hidden sm:block' />
            <span className='text-white/40'> and your first upload.</span>
          </h2>
          <p className='mt-5 max-w-xl text-lg leading-relaxed text-white/55'>
            One payment kicks off the whole chain — detection, provisioning,
            credentials. You never talk to a billing form.
          </p>
        </motion.div>

        {/* Asymmetric bento */}
        <div className='mt-16 grid gap-4 md:grid-cols-6'>
          {/* Large: provisioning sequence */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className='md:col-span-4 md:row-span-2'
          >
            <Tilt strength={3} className='h-full'>
              <div className='shell h-full'>
                <div className='shell-core flex h-full flex-col justify-between overflow-hidden p-8'>
                  <div>
                    <h3 className='text-2xl font-semibold tracking-tight'>
                      Provisioned in under a minute
                    </h3>
                    <p className='mt-3 max-w-md text-[15px] leading-relaxed text-white/55'>
                      The indexer watches the chain, credits your balance, and a
                      dedicated bucket with scoped credentials appears in your
                      dashboard. No ticket, no wait.
                    </p>
                  </div>

                  {/* Live provisioning log */}
                  <div className='mt-8 rounded-xl border border-white/[0.07] bg-black/40 p-5 font-mono text-[13px]'>
                    {provisionLog.map((line, i) => (
                      <motion.div
                        key={line.text}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.18, ease: EASE }}
                        className='flex items-center gap-3 py-1.5'
                      >
                        {line.done ? (
                          <Check className='h-3.5 w-3.5 shrink-0 text-accent' />
                        ) : (
                          <span className='h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-white/20 border-t-accent' />
                        )}
                        <span className={line.done ? 'text-white/70' : 'text-accent'}>
                          {line.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Tilt>
          </motion.div>

          {/* Pay with SOL */}
          <BentoCard
            delay={0.08}
            className='md:col-span-2'
            title='Pay with SOL'
            body='Phantom or Solflare, one signature. Finality in ~400 ms — faster than a card authorization.'
            figure='~400 ms'
          />

          {/* Zero egress */}
          <BentoCard
            delay={0.16}
            className='md:col-span-2'
            title='Zero egress fees'
            body='Built on Cloudflare R2. Serve as much traffic as you want; the download bill stays at zero.'
            figure='$0.00'
          />

          {/* Encrypted credentials */}
          <BentoCard
            delay={0.1}
            className='md:col-span-2'
            title='Credentials, encrypted'
            body='Every access key is AES-256-GCM encrypted before it touches the database, with rotation built in.'
            figure='AES-256'
          />

          {/* S3-compatible wide card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
            className='min-w-0 md:col-span-4'
          >
            <Tilt strength={3} className='h-full'>
              <div className='shell h-full'>
                <div className='shell-core flex h-full flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='max-w-xs'>
                    <h3 className='text-xl font-semibold tracking-tight'>
                      Works with the S3 SDK you already use
                    </h3>
                    <p className='mt-2.5 text-[15px] leading-relaxed text-white/55'>
                      Point your existing tooling at the R2 endpoint and keep
                      shipping.
                    </p>
                  </div>
                  <pre className='min-w-0 max-w-full overflow-x-auto rounded-xl border border-white/[0.07] bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-white/70'>
{`new S3Client({
  endpoint: "https://…r2.cloudflarestorage.com",
  credentials: { /* from your dashboard */ },
})`}
                  </pre>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function BentoCard({
  title,
  body,
  figure,
  className,
  delay = 0,
}: {
  title: string
  body: string
  figure: string
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      <Tilt strength={5} className='h-full'>
        <div className='shell h-full'>
          <div className='shell-core flex h-full flex-col justify-between p-7'>
            <div>
              <h3 className='text-xl font-semibold tracking-tight'>{title}</h3>
              <p className='mt-2.5 text-[14.5px] leading-relaxed text-white/55'>
                {body}
              </p>
            </div>
            <p className='tabular mt-6 font-mono text-2xl font-medium text-accent'>
              {figure}
            </p>
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

export default WhySolStore
