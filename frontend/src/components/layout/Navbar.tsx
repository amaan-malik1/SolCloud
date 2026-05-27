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
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        {/* nav logo  */}
        <div className='flex justify-center items-center border-2 border-gray-600 px-8 py-2 shadow-lg shadow-gray-900  bg-transparent backdrop-blur-lg rounded-full '>
          <Link to="/"><Logo size="md" /></Link>
        </div>

        {/* nav Auth btns */}
        <div className="flex justify-center items-center gap-4 border-2 border-gray-600 px-8 py-2 shadow-lg shadow-gray-900  bg-transparent backdrop-blur-lg rounded-full">
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
