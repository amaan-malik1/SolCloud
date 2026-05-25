import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { Logo } from '../shared/Logo'
import { useAuthStore } from '../../store/auth.store'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, clearAuth } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(5,5,8,0.8)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link to="/"><Logo size="md" /></Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-white/50 font-body hidden sm:block">
                {user?.email}
              </span>
              <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-2">
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <button onClick={clearAuth} className="p-2 rounded-lg text-white/50 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors font-body">
                Log in
              </Link>
              <Link to="/register" className="glow-purple px-4 py-2 rounded-lg bg-gradient-to-r from-sol-purple to-[#7233cc] text-white text-sm font-medium">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
