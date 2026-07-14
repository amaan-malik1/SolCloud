import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { Logo } from '../shared/Logo'
import { useAuthStore } from '../../store/auth.store'

const NAV_LINKS = [
  { href: '#why-solStore', label: 'Features' },
  { href: '#how-it-work', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthenticated, clearAuth } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <nav className='fixed left-0 right-0 top-0 z-40 px-4 py-4 sm:px-6 sm:py-5'>
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl transition-all duration-500 ease-out-expo sm:px-6 ${
          scrolled
            ? 'border-white/10 bg-dark-bg/80 shadow-[0_16px_50px_rgba(0,0,0,0.5)]'
            : 'border-white/5 bg-dark-bg/40'
        }`}
      >
        <Link to='/' className='flex items-center gap-3' onClick={() => setOpen(false)}>
          <Logo size='sm' />
        </Link>

        {/* Desktop links */}
        <div className='hidden items-center gap-8 md:flex'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-sm text-white/55 transition-colors duration-300 hover:text-white'
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className='flex items-center gap-3'>
          {isAuthenticated ? (
            <>
              <Link
                to='/dashboard'
                className='flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06]'
              >
                <User className='h-4 w-4' />
                Dashboard
              </Link>
              <button
                onClick={clearAuth}
                aria-label='Log out'
                className='rounded-full p-2 text-white/40 transition-colors duration-300 hover:text-white'
              >
                <LogOut className='h-4 w-4' />
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='hidden text-sm text-white/55 transition-colors duration-300 hover:text-white sm:block'
              >
                Log in
              </Link>
              <Link
                to='/register'
                className='rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink transition-all duration-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.35)] active:scale-[0.98]'
              >
                Get started
              </Link>
            </>
          )}

          {/* Hamburger — morphs to X */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className='relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] md:hidden'
          >
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-300 ease-out-expo ${
                open ? 'rotate-45' : '-translate-y-[3px]'
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-300 ease-out-expo ${
                open ? '-rotate-45' : 'translate-y-[3px]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-[-1] bg-dark-bg/95 backdrop-blur-2xl md:hidden'
          >
            <div className='flex h-full flex-col justify-center px-8'>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE }}
                  className='border-b border-white/5 py-5 text-3xl font-semibold tracking-tight text-white'
                >
                  {link.label}
                </motion.a>
              ))}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
                  className='mt-8 flex flex-col gap-3'
                >
                  <Link
                    to='/register'
                    onClick={() => setOpen(false)}
                    className='rounded-full bg-accent px-6 py-3.5 text-center text-sm font-semibold text-accent-ink'
                  >
                    Get started free
                  </Link>
                  <Link
                    to='/login'
                    onClick={() => setOpen(false)}
                    className='rounded-full border border-white/10 px-6 py-3.5 text-center text-sm text-white/70'
                  >
                    Log in
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
