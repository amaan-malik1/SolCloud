import { Link } from 'react-router-dom'
import { Logo } from '../shared/Logo'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  footerText: string
  footerLink: string
  footerLinkText: string
}

export function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkText }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex flex-col">
      <div aria-hidden className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(153,69,255,0.12), transparent 70%)' }} />
      <header className="relative z-10 flex justify-between items-center px-8 py-5">
        <Link to="/"><Logo size="sm" /></Link>
        <p className="text-sm text-white/40 font-body">
          {footerText}{' '}
          <Link to={footerLink} className="text-sol-purple hover:text-sol-purple/80 transition-colors">{footerLinkText}</Link>
        </p>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md rounded-2xl p-8"
          style={{ background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl tracking-tight text-white mb-2">{title}</h1>
            <p className="text-sm text-white/45 font-body">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
      <footer className="relative z-10 text-center pb-6">
        <p className="text-xs text-white/20 font-body">Secured by Solana · Built in India</p>
      </footer>
    </div>
  )
}
