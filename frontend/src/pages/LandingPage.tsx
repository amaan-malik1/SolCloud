import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-bg grid-bg">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen text-center px-6 relative">
        <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(153,69,255,0.14), transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
            style={{ borderColor: 'rgba(20,241,149,0.25)', background: 'rgba(20,241,149,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-pulse" style={{ boxShadow: '0 0 6px #14F195' }} />
            <span className="text-sol-green text-xs font-medium tracking-widest uppercase font-body">Superteam India · Solana Foundation Grant</span>
          </div>
          <h1 className="font-display font-extrabold leading-none tracking-tighter mb-6" style={{ fontSize: 'clamp(52px, 8vw, 88px)', letterSpacing: '-3px' }}>
            Cloud storage.<br /><span className="gradient-text">No card required.</span>
          </h1>
          <p className="text-white/50 font-body font-light leading-relaxed mb-10 mx-auto" style={{ fontSize: 'clamp(16px, 2vw, 19px)', maxWidth: '540px' }}>
            Pay with SOL. Get instant access to production-grade Cloudflare R2 storage. No credit card, no rejected debit cards, no friction.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <Link to="/register" className="glow-purple px-7 py-3.5 rounded-xl bg-gradient-to-r from-sol-purple to-[#7233cc] text-white font-medium font-body text-[15px]">
              Get started free →
            </Link>
            <Link to="/login" className="px-7 py-3.5 rounded-xl border border-white/10 text-white font-medium font-body text-[15px] hover:border-sol-purple/40 hover:bg-sol-purple/5 transition-all duration-200">
              Log in
            </Link>
          </div>
          <div className="flex flex-wrap gap-10 justify-center pt-10 border-t border-white/7">
            {[
              { value: '450M+', label: 'Indians without\nan accepted credit card' },
              { value: '<400ms', label: 'Solana payment\nfinality' },
              { value: '$0.00', label: 'Egress fees on\nCloudflare R2' },
              { value: '10 GB', label: 'Free storage\ntier included' },
            ].map(stat => (
              <div key={stat.value} className="text-center">
                <div className="font-display font-bold gradient-text-green" style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-1px' }}>{stat.value}</div>
                <div className="text-white/40 text-xs mt-1 font-body leading-tight whitespace-pre-line">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
