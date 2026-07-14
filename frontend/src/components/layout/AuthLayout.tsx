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
    <div className="min-h-[100dvh] bg-dark-bg grid-bg flex flex-col">
      <div aria-hidden className="fixed top-0 left-1/2 -translate-x-1/2 w-[640px] h-[420px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(52,211,153,0.09), transparent 70%)' }} />
      <header className="relative z-10 flex justify-between items-center px-8 py-5">
        <Link to="/"><Logo size="sm" /></Link>
        <p className="text-sm text-white/40">
          {footerText}{' '}
          <Link to={footerLink} className="text-accent hover:text-accent-bright transition-colors duration-300">{footerLinkText}</Link>
        </p>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md shell">
          <div className="shell-core p-8">
            <div className="mb-8">
              <h1 className="font-semibold text-2xl tracking-tight text-white mb-2">{title}</h1>
              <p className="text-sm text-white/50">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
      <footer className="relative z-10 text-center pb-6">
        <p className="text-xs text-white/25">Secured by Solana · Built in India</p>
      </footer>
    </div>
  )
}
