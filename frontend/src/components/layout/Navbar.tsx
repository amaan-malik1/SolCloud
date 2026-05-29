import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User, Github } from 'lucide-react'
import { Logo } from '../shared/Logo'
import { useAuthStore } from '../../store/auth.store'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)

    window.addEventListener('scroll', handler, {
      passive: true,
    })

    return () =>
      window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 px-6 py-5'>
      <div
        className={`
          mx-auto flex max-w-7xl items-center justify-between
          rounded-full px-6 py-3
          transition-all duration-300
          backdrop-blur-xl
          border
          ${scrolled
            ? 'border-white/10 bg-black/60 shadow-2xl'
            : 'border-white/5 bg-black/30'
          }
        `}
      >
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-3'
        >
          <Logo size='md' />
        </Link>

        {/* Center Nav */}
        <div className='hidden items-center gap-8 md:flex'>
          <a
            href='#why-solStore'
            className='text-sm text-zinc-400 transition-colors hover:text-white'
          >
            Features
          </a>

          <a
            href='#how-it-work'
            className='text-sm text-zinc-400 transition-colors hover:text-white'
          >
            How it Works
          </a>

          <a
            href='#pricing'
            className='text-sm text-zinc-400 transition-colors hover:text-white'
          >
            Pricing
          </a>
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-3'>
          {isAuthenticated ? (
            <>
              <span className='hidden text-sm text-zinc-500 lg:block'>
                {user?.email}
              </span>

              <Link
                to='/dashboard'
                className='flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white transition-all hover:border-white/20 hover:bg-white/[0.06]'
              >
                <User className='h-4 w-4' />
                Dashboard
              </Link>

              <button
                onClick={clearAuth}
                className='rounded-full p-2 text-zinc-500 transition-colors hover:text-white'
              >
                <LogOut className='h-4 w-4' />
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='text-sm text-zinc-400 transition-colors hover:text-white'
              >
                Login
              </Link>

              <a
                href='https://github.com/amaan-malik1/solstore'
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition-all hover:border-white/20 hover:bg-white/[0.06]'
              >
                <Github className='h-4 w-4' />
                GitHub
              </a>

              <Link
                to='/register'
                className='rounded-full bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 text-sm font-medium text-black transition-all hover:scale-[1.02]'
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}