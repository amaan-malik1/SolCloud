import { Link } from 'react-router-dom'
import { Logo } from './Logo'

const Footer = () => {
  return (
    <footer className='relative overflow-hidden text-white'>
      <div className='relative z-10 mx-auto max-w-6xl px-6 pb-44 pt-10'>
        <div className='mb-16 border-t border-white/[0.08]' />

        <div className='flex flex-col justify-between gap-12 md:flex-row'>
          {/* Brand */}
          <div className='max-w-sm'>
            <Link to='/' className='inline-block'>
              <Logo size='md' />
            </Link>
            <p className='mt-5 text-[15px] leading-relaxed text-white/45'>
              Dedicated Cloudflare R2 object storage, paid for in SOL. Built for
              developers the banking system left waiting.
            </p>
            <p className='mt-6 text-sm text-white/30'>
              © 2026 SolStore. All rights reserved.
            </p>
          </div>

          <div className='flex gap-16 sm:gap-24'>
            {/* Product */}
            <div>
              <h3 className='text-sm font-semibold text-white/80'>Product</h3>
              <ul className='mt-5 space-y-3.5 text-sm text-white/50'>
                <li>
                  <a href='#why-solStore' className='transition-colors duration-300 hover:text-accent'>
                    Features
                  </a>
                </li>
                <li>
                  <a href='#how-it-work' className='transition-colors duration-300 hover:text-accent'>
                    How it works
                  </a>
                </li>
                <li>
                  <a href='#pricing' className='transition-colors duration-300 hover:text-accent'>
                    Pricing
                  </a>
                </li>
                <li>
                  <Link to='/register' className='transition-colors duration-300 hover:text-accent'>
                    Get started
                  </Link>
                </li>
              </ul>
            </div>

            {/* Elsewhere */}
            <div>
              <h3 className='text-sm font-semibold text-white/80'>Elsewhere</h3>
              <ul className='mt-5 space-y-3.5 text-sm text-white/50'>
                <li>
                  <a
                    href='https://x.com/amaaan_malik'
                    target='_blank'
                    rel='noreferrer'
                    className='transition-colors duration-300 hover:text-accent'
                  >
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a
                    href='https://github.com/amaan-malik1/solstore'
                    target='_blank'
                    rel='noreferrer'
                    className='transition-colors duration-300 hover:text-accent'
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        aria-hidden
        className='pointer-events-none absolute bottom-[-60px] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[160px] font-semibold leading-none tracking-[-0.04em] text-white/[0.025] md:bottom-[-110px] md:text-[300px]'
      >
        SolStore
      </div>
    </footer>
  )
}

export default Footer
