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


// import TypingText from '@/components/shared/TypingText';
// import { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'

// // ── Particle Canvas 
// // function ParticleCanvas() {
// //   const ref = useRef<HTMLCanvasElement>(null)

// //   useEffect(() => {
// //     const canvas = ref.current
// //     if (!canvas) return
// //     const ctx = canvas.getContext('2d')
// //     if (!ctx) return

// //     let raf: number
// //     let W = window.innerWidth
// //     let H = window.innerHeight
// //     canvas.width = W
// //     canvas.height = H

// //     const onResize = () => {
// //       W = window.innerWidth; H = window.innerHeight
// //       canvas.width = W; canvas.height = H
// //     }
// //     window.addEventListener('resize', onResize)

// //     const COLORS = ['#9945FF', '#14F195', '#00C2FF']
// //     const N = 120

// //     type Dot = { x: number; y: number; z: number; bx: number; by: number; bz: number; s: number; c: string }
// //     const dots: Dot[] = Array.from({ length: N }, () => {
// //       const theta = Math.random() * Math.PI * 2
// //       const phi = Math.acos(2 * Math.random() - 1)
// //       const r = 180 + Math.random() * 120
// //       return {
// //         x: r * Math.sin(phi) * Math.cos(theta),
// //         y: r * Math.sin(phi) * Math.sin(theta),
// //         z: r * Math.cos(phi),
// //         bx: r * Math.sin(phi) * Math.cos(theta),
// //         by: r * Math.sin(phi) * Math.sin(theta),
// //         bz: r * Math.cos(phi),
// //         s: Math.random() * 1.8 + 0.4,
// //         c: COLORS[Math.floor(Math.random() * COLORS.length)],
// //       }
// //     })

// //     let mx = 0, my = 0
// //     const onMove = (e: MouseEvent) => { mx = (e.clientX - W / 2) / W; my = (e.clientY - H / 2) / H }
// //     window.addEventListener('mousemove', onMove)

// //     let t = 0
// //     const proj = (x: number, y: number, z: number) => {
// //       const f = 550 / (550 + z)
// //       return { px: x * f + W / 2, py: y * f + H / 2, f }
// //     }
// //     const ry = (x: number, z: number, a: number) => ({ rx: x * Math.cos(a) + z * Math.sin(a), rz: -x * Math.sin(a) + z * Math.cos(a) })
// //     const rx = (y: number, z: number, a: number) => ({ ry2: y * Math.cos(a) - z * Math.sin(a), rz2: y * Math.sin(a) + z * Math.cos(a) })

// //     const tick = () => {
// //       ctx.clearRect(0, 0, W, H)
// //       t += 0.003

// //       const pts = dots.map(d => {
// //         let x = d.bx + Math.sin(t + d.bx * 0.005) * 10
// //         let y = d.by + Math.cos(t * 0.8 + d.by * 0.005) * 10
// //         let z = d.bz + Math.sin(t * 0.6 + d.bz * 0.005) * 10
// //         const r1 = ry(x, z, t * 0.18 + mx * 0.9); x = r1.rx; z = r1.rz
// //         const r2 = rx(y, z, t * 0.12 + my * 0.9); y = r2.ry2; z = r2.rz2
// //         return { ...proj(x, y, z), c: d.c, s: d.s, z }
// //       }).sort((a, b) => a.z - b.z)

// //       // connections
// //       for (let i = 0; i < pts.length; i++) {
// //         for (let j = i + 1; j < pts.length; j++) {
// //           const dx = pts[i].px - pts[j].px
// //           const dy = pts[i].py - pts[j].py
// //           const dist = Math.sqrt(dx * dx + dy * dy)
// //           if (dist < 90) {
// //             ctx.beginPath()
// //             ctx.moveTo(pts[i].px, pts[i].py)
// //             ctx.lineTo(pts[j].px, pts[j].py)
// //             ctx.strokeStyle = `rgba(153,69,255,${(1 - dist / 90) * 0.12})`
// //             ctx.lineWidth = 0.5
// //             ctx.stroke()
// //           }
// //         }
// //       }

// //       // dots
// //       pts.forEach(p => {
// //         const sz = p.s * p.f * 2
// //         const alpha = Math.max(0.15, (p.z + 350) / 700)
// //         const g = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, sz * 2.5)
// //         g.addColorStop(0, p.c + Math.floor(alpha * 255).toString(16).padStart(2, '0'))
// //         g.addColorStop(1, p.c + '00')
// //         ctx.beginPath()
// //         ctx.arc(p.px, p.py, sz, 0, Math.PI * 2)
// //         ctx.fillStyle = g
// //         ctx.fill()
// //       })

// //       raf = requestAnimationFrame(tick)
// //     }
// //     tick()

// //     return () => {
// //       cancelAnimationFrame(raf)
// //       window.removeEventListener('resize', onResize)
// //       window.removeEventListener('mousemove', onMove)
// //     }
// //   }, [])

// //   return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.65 }} />
// // }

// // ── Animated Counter ────────────────────────────────────────────────────────
// function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
//   const [count, setCount] = useState(0)
//   const ref = useRef<HTMLDivElement>(null)
//   const started = useRef(false)

//   useEffect(() => {
//     const el = ref.current
//     if (!el) return
//     const obs = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting && !started.current) {
//         started.current = true
//         const duration = 2000
//         const start = performance.now()
//         const step = (now: number) => {
//           const p = Math.min((now - start) / duration, 1)
//           const ease = 1 - Math.pow(1 - p, 3)
//           setCount(Math.floor(ease * target))
//           if (p < 1) requestAnimationFrame(step)
//           else setCount(target)
//         }
//         requestAnimationFrame(step)
//       }
//     }, { threshold: 0.5 })
//     obs.observe(el)
//     return () => obs.disconnect()
//   }, [target])

//   return <div ref={ref}>{prefix}{count.toLocaleString()}{suffix}</div>
// }

// // ── Reveal wrapper 
// function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const el = ref.current
//     if (!el) return
//     el.style.opacity = '0'
//     el.style.transform = `translateY(${y}px)`
//     el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`

//     const obs = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting) {
//         el.style.opacity = '1'
//         el.style.transform = 'translateY(0)'
//         obs.disconnect()
//       }
//     }, { threshold: 0.1 })
//     obs.observe(el)
//     return () => obs.disconnect()
//   }, [delay, y])

//   return <div ref={ref}>{children}</div>
// }


// // ── 3D Card 

// function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
//   const ref = useRef<HTMLDivElement>(null)

//   const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const el = ref.current
//     if (!el) return
//     const rect = el.getBoundingClientRect()
//     const x = (e.clientX - rect.left) / rect.width - 0.5
//     const y = (e.clientY - rect.top) / rect.height - 0.5
//     el.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)`
//     el.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(153,69,255,0.15)`
//   }

//   const onLeave = () => {
//     const el = ref.current
//     if (!el) return
//     el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
//     el.style.boxShadow = 'none'
//   }

//   return (
//     <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
//       className={className}
//       style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', transformStyle: 'preserve-3d' }}>
//       {children}
//     </div>
//   )
// }

// // ── Glow Button 
// function GlowButton({ to, children, variant = 'primary' }: { to: string; children: React.ReactNode; variant?: 'primary' | 'ghost' }) {
//   const ref = useRef<HTMLAnchorElement>(null)

//   const onMove = (e: React.MouseEvent) => {
//     const el = ref.current
//     if (!el) return
//     const rect = el.getBoundingClientRect()
//     el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
//     el.style.setProperty('--my', `${e.clientY - rect.top}px`)
//   }

//   if (variant === 'primary') {
//     return (
//       <Link to={to} ref={ref} onMouseMove={onMove}
//         style={{
//           position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center',
//           gap: 8, padding: '14px 32px', borderRadius: 14,
//           background: 'linear-gradient(135deg, #9945FF, #7233cc)',
//           color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none',
//           boxShadow: '0 0 30px rgba(153,69,255,0.4)',
//           transition: 'box-shadow 0.2s, transform 0.2s',
//           fontFamily: 'DM Sans, sans-serif',
//         }}
//         onMouseEnter={e => {
//           const el = e.currentTarget
//           el.style.boxShadow = '0 0 50px rgba(153,69,255,0.7)'
//           el.style.transform = 'translateY(-2px)'
//         }}
//         onMouseLeave={e => {
//           const el = e.currentTarget
//           el.style.boxShadow = '0 0 30px rgba(153,69,255,0.4)'
//           el.style.transform = 'translateY(0)'
//         }}
//       >
//         {children}
//       </Link>
//     )
//   }

//   return (
//     <Link to={to}
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: 8,
//         padding: '14px 32px', borderRadius: 14,
//         border: '1px solid rgba(255,255,255,0.12)',
//         color: '#fff', fontWeight: 500, fontSize: 15, textDecoration: 'none',
//         transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
//         fontFamily: 'DM Sans, sans-serif',
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.borderColor = 'rgba(153,69,255,0.5)'
//         e.currentTarget.style.background = 'rgba(153,69,255,0.08)'
//         e.currentTarget.style.transform = 'translateY(-2px)'
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
//         e.currentTarget.style.background = 'transparent'
//         e.currentTarget.style.transform = 'translateY(0)'
//       }}
//     >
//       {children}
//     </Link>
//   )
// }

// // ── Flow diagram 
// function FlowStep({ num, icon, title, body, accent }: {
//   num: string; icon: string; title: string; body: string; accent: string
// }) {
//   const hex: Record<string, string> = { purple: '#9945FF', green: '#14F195', blue: '#00C2FF' }
//   const c = hex[accent] || '#9945FF'
//   return (
//     <Card3D className="p-7 rounded-2xl flex flex-col gap-4"
//       style={{ background: 'rgba(19,19,31,0.9)', border: `1px solid rgba(255,255,255,0.07)` } as any}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//         <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c}18`, border: `1px solid ${c}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
//           {icon}
//         </div>
//         <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.2)', fontFamily: 'Fira Code, monospace' }}>STEP {num}</span>
//       </div>
//       <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.5px' }}>{title}</h3>
//       <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>{body}</p>
//       <div style={{ height: 2, borderRadius: 1, background: `linear-gradient(90deg, ${c}, transparent)`, width: '40%' }} />
//     </Card3D>
//   )
// }

// // ── Market card 
// function MarketCard({ value, color, label, sub }: { value: string; color: string; label: string; sub: string }) {
//   return (
//     <Card3D className="p-7 rounded-2xl"
//       style={{ background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)' } as any}>
//       <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 38, letterSpacing: '-2px', color, marginBottom: 8, lineHeight: 1 }}>{value}</div>
//       <div style={{ fontWeight: 500, color: '#fff', fontSize: 14, marginBottom: 6 }}>{label}</div>
//       <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>{sub}</div>
//     </Card3D>
//   )
// }

// // ── Roadmap phase 
// function RoadmapPhase({ tag, tagColor, phase, period, items, active }: {
//   tag: string; tagColor: string; phase: string; period: string; items: string[]; active?: boolean
// }) {
//   const colors: Record<string, string> = { green: '#14F195', purple: '#9945FF', gray: 'rgba(255,255,255,0.4)' }
//   const c = colors[tagColor] || '#9945FF'
//   return (
//     <div className="p-6" style={{
//       background: active ? 'rgba(26,26,42,1)' : 'rgba(19,19,31,1)',
//       transition: 'background 0.2s',
//     }}
//       onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,26,42,1)' }}
//       onMouseLeave={e => { e.currentTarget.style.background = active ? 'rgba(26,26,42,1)' : 'rgba(19,19,31,1)' }}>
//       <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, background: `${c}18`, color: c, marginBottom: 12 }}>{tag}</span>
//       <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 4 }}>{phase}</div>
//       <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>{period}</div>
//       <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
//         {items.map((item, i) => (
//           <li key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', padding: '3px 0 3px 14px', position: 'relative', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif' }}>
//             <span style={{ position: 'absolute', left: 0, color: 'rgba(255,255,255,0.2)' }}>–</span>
//             {item}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// // ── Main LandingPage 

// export default function LandingPage() {
//   const [scrollY, setScrollY] = useState(0)
//   const [navBg, setNavBg] = useState(false)
//   const [mobileMenu, setMobileMenu] = useState(false)

//   useEffect(() => {
//     const onScroll = () => {
//       setScrollY(window.scrollY)
//       setNavBg(window.scrollY > 30)
//     }
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   return (
//     <div style={{ background: '#050508', minHeight: '100vh', overflowX: 'hidden', color: '#f0f0f8' }}>

//       {/* Global styles */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Fira+Code:wght@400;500&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         .gradient-text {
//           background: linear-gradient(135deg, #fff 0%, #14F195 55%, #9945FF 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }

//         .sol-gradient { background: linear-gradient(135deg, #9945FF, #14F195); }

//         .grid-bg {
//           background-image:
//             linear-gradient(rgba(153,69,255,0.025) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(153,69,255,0.025) 1px, transparent 1px);
//           background-size: 60px 60px;
//         }

//         @keyframes rotateCube {
//           0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
//           100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
//         }

//         @keyframes floatOrb {
//           0%, 100% { transform: translateY(0) scale(1); }
//           50% { transform: translateY(-20px) scale(1.05); }
//         }

//         @keyframes badgePulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(0.8); }
//         }

//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(30px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes shimmer {
//           0% { background-position: -200% center; }
//           100% { background-position: 200% center; }
//         }

//         @keyframes spinSlow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         @keyframes pulseRing {
//           0% { transform: scale(0.8); opacity: 1; }
//           100% { transform: scale(2); opacity: 0; }
//         }

//         @keyframes scanLine {
//           0% { top: 0%; }
//           100% { top: 100%; }
//         }
//       `}</style>

//       {/* Particle field */}
//       <ParticleCanvas />

//       {/* Grid */}
//       <div className="grid-bg fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

//       {/* Ambient glows */}
//       <div className="fixed pointer-events-none" style={{ zIndex: 0, top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(153,69,255,0.12) 0%, transparent 65%)', filter: 'blur(40px)' }} />
//       <div className="fixed pointer-events-none" style={{ zIndex: 0, bottom: '-20%', right: '-10%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(20,241,149,0.07) 0%, transparent 65%)', filter: 'blur(40px)' }} />

//       {/* 3D floating elements */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
//         {/* Rotating cubes */}
//         {[
//           { x: 8, y: 20, size: 28, color: '#9945FF', delay: 0, speed: 0.8 },
//           { x: 90, y: 15, size: 20, color: '#14F195', delay: 1.5, speed: 1.2 },
//           { x: 85, y: 55, size: 35, color: '#00C2FF', delay: 0.8, speed: 0.6 },
//           { x: 5, y: 65, size: 22, color: '#9945FF', delay: 2, speed: 1 },
//           { x: 92, y: 80, size: 18, color: '#14F195', delay: 0.5, speed: 1.4 },
//           { x: 15, y: 85, size: 25, color: '#00C2FF', delay: 1.2, speed: 0.9 },
//         ].map((c, i) => (
//           <div key={i} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%`, perspective: 600 }}>
//             <div style={{ width: c.size, height: c.size, position: 'relative', transformStyle: 'preserve-3d', animation: `rotateCube ${7 / c.speed}s linear infinite`, animationDelay: `${c.delay}s` }}>
//               {[
//                 `translateZ(${c.size / 2}px)`,
//                 `translateZ(-${c.size / 2}px) rotateY(180deg)`,
//                 `rotateY(90deg) translateZ(${c.size / 2}px)`,
//                 `rotateY(-90deg) translateZ(${c.size / 2}px)`,
//                 `rotateX(90deg) translateZ(${c.size / 2}px)`,
//                 `rotateX(-90deg) translateZ(${c.size / 2}px)`,
//               ].map((tf, fi) => (
//                 <div key={fi} style={{ position: 'absolute', width: '100%', height: '100%', transform: tf, background: `${c.color}18`, border: `1px solid ${c.color}40` }} />
//               ))}
//             </div>
//           </div>
//         ))}

//         {/* Floating orbs */}
//         {[
//           { x: 20, y: 40, size: 80, color: '#9945FF', delay: 0 },
//           { x: 75, y: 30, size: 60, color: '#14F195', delay: 2 },
//           { x: 50, y: 70, size: 100, color: '#00C2FF', delay: 1 },
//         ].map((o, i) => (
//           <div key={i} style={{ position: 'absolute', left: `${o.x}%`, top: `${o.y}%`, width: o.size, height: o.size, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${o.color}30, transparent 70%)`, border: `1px solid ${o.color}20`, animation: `floatOrb ${5 + o.delay}s ease-in-out infinite`, animationDelay: `${o.delay}s`, boxShadow: `0 0 ${o.size}px ${o.color}10` }} />
//         ))}
//       </div>

//       {/* ── NAVBAR ── */}
//       <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s', background: navBg ? 'rgba(5,5,8,0.85)' : 'transparent', backdropFilter: navBg ? 'blur(20px)' : 'none', borderBottom: navBg ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent' }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
//             <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#9945FF,#14F195)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 900, color: '#000', fontSize: 14 }}>S</div>
//             <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.5px' }}>SolStore</span>
//           </Link>

//           {/* Desktop nav */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
//             {[['#problem', 'Problem'], ['#how', 'How it works'], ['#market', 'Market'], ['#roadmap', 'Roadmap']].map(([href, label]) => (
//               <a key={href} href={href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif' }}
//                 onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
//                 onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>{label}</a>
//             ))}
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Link to="/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s' }}
//               onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
//               onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>Log in</Link>
//             <Link to="/register" style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#9945FF,#7233cc)', color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 20px rgba(153,69,255,0.35)', transition: 'box-shadow 0.2s, transform 0.2s' }}
//               onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 35px rgba(153,69,255,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
//               onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(153,69,255,0.35)'; e.currentTarget.style.transform = 'translateY(0)' }}>
//               Get started
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>

//         {/* Pulsing ring behind hero */}
//         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(153,69,255,0.08)', animation: 'pulseRing 4s ease-out infinite', pointerEvents: 'none' }} />
//         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(153,69,255,0.12)', animation: 'pulseRing 4s ease-out infinite 1s', pointerEvents: 'none' }} />

//         <div style={{ maxWidth: 780, position: 'relative' }}>
//           {/* Badge */}
//           <div style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '0ms' }}>
//             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(20,241,149,0.25)', background: 'rgba(20,241,149,0.06)', marginBottom: 32 }}>
//               <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14F195', animation: 'badgePulse 2s infinite', boxShadow: '0 0 8px #14F195' }} />
//               <span style={{ fontSize: 12, fontWeight: 500, color: '#14F195', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
//                 SolStore
//               </span>
//             </div>
//           </div>

//           {/* Headline */}
//           <div style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '80ms' }}>
//             <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(48px, 8vw, 92px)', lineHeight: 1.0, letterSpacing: '-3px', marginBottom: 24, color: '#E5E4E2' }}>
//               Cloud storage.<br />
//               <TypingText words={['No card required.', 'Pay with SOL.', 'Built for early devs.', 'Permissionless.']} />
//             </h1>
//           </div>

//           {/* Sub */}
//           <div style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '160ms' }}>
//             <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.5)', maxWidth: 560, lineHeight: 1.75, marginBottom: 48, fontWeight: 300, fontFamily: 'DM Sans, sans-serif', margin: '0 auto 48px' }}>
//               SolStore is a permissionless cloud storage layer built on Solana. Pay in SOL, get instant access to production-grade Cloudflare R2 object storage — no credit card, no rejected debit cards, zero friction.
//             </p>
//           </div>

//           {/* CTAs */}
//           <div style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '240ms', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 80 }}>
//             <GlowButton to="/register">Get started free →</GlowButton>
//             <GlowButton to="/login" variant="ghost">Log in</GlowButton>
//           </div>

//           {/* Stats */}
//           <div style={{ animation: 'fadeSlideUp 0.6s ease both', animationDelay: '320ms', display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
//             {[
//               { value: 450, suffix: 'M+', label: 'Indians without\nan accepted credit card' },
//               { value: 400, prefix: '<', suffix: 'ms', label: 'Solana payment\nfinality' },
//               { value: 0, prefix: '$', suffix: '.00', label: 'Egress fees on\nCloudflare R2' },
//               { value: 10, suffix: ' GB', label: 'Free storage\ntier included' },
//             ].map((s, i) => (
//               <div key={i} style={{ textAlign: 'center' }}>
//                 <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(22px,3vw,30px)', letterSpacing: '-1px', background: 'linear-gradient(135deg,#fff,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
//                   <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
//                 </div>
//                 <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontFamily: 'DM Sans, sans-serif', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{s.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── PROBLEM ── */}
//       <section id="problem" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
//             <Reveal>
//               <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>The Problem</p>
//               <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,48px)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>
//                 Cloud giants gatekeep their free tiers.
//               </h2>
//               <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans, sans-serif', marginBottom: 24 }}>
//                 AWS, Google Cloud, and Azure all require a valid international credit card — even for their free tiers. For 450M+ Indians relying on UPI, debit cards, or prepaid instruments, these platforms are completely inaccessible. <strong style={{ color: '#fff', fontWeight: 500 }}>SolStore removes this gate with permissionless SOL payments.</strong>
//               </p>
//               <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
//                 <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg,#9945FF,#14F195)' }} />
//                 Personally validated with 20+ Indian developers
//               </div>
//             </Reveal>

//             <Reveal delay={120}>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//                 {[
//                   { icon: '✗', type: 'red', title: 'AWS S3 rejects Indian debit cards', body: 'Even for the free tier. Visa/Mastercard debit cards issued by Indian banks fail AWS billing validation — personally verified.' },
//                   { icon: '⚠', type: 'amber', title: 'Students can\'t learn cloud', body: 'Cloud education is blocked at the payment step for hundreds of millions of developers across India and Southeast Asia.' },
//                   { icon: '✗', type: 'red', title: 'SOL holders have nowhere to go', body: 'Crypto-native users who want to pay for infra with on-chain assets have zero legitimate options today. SolStore is first.' },
//                   { icon: '⚠', type: 'amber', title: 'Workarounds violate ToS', body: 'Shared accounts, virtual cards, informal access — all violate platform terms and create real security risks.' },
//                 ].map((p, i) => (
//                   <div key={i} style={{ padding: '18px 22px', background: 'rgba(19,19,31,1)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'border-color 0.2s, background 0.2s', cursor: 'default' }}
//                     onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(153,69,255,0.25)'; e.currentTarget.style.background = 'rgba(26,26,42,1)' }}
//                     onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(19,19,31,1)' }}>
//                     <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: p.type === 'red' ? 'rgba(255,80,80,0.08)' : 'rgba(255,200,50,0.08)', border: p.type === 'red' ? '1px solid rgba(255,80,80,0.2)' : '1px solid rgba(255,200,50,0.2)', flexShrink: 0 }}>{p.icon}</div>
//                     <div>
//                       <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{p.title}</div>
//                       <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif' }}>{p.body}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </Reveal>
//           </div>
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ── */}
//       <section id="how" style={{ padding: '100px 24px', background: 'rgba(10,10,16,1)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <div style={{ textAlign: 'center', marginBottom: 56 }}>
//               <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>The Solution</p>
//               <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>Pay SOL. Get storage. Under 60 seconds.</h2>
//               <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 540, margin: '0 auto', lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans, sans-serif' }}>Secure middleware layer. Solana blockchain indexer. Instant Cloudflare R2 provisioning. Fully automated — no human in the loop.</p>
//             </div>
//           </Reveal>

//           <Reveal delay={80}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
//               <FlowStep num="01" icon="◎" accent="purple" title="Connect wallet, send SOL" body="Connect Phantom or Solflare. Our frontend constructs a Solana transaction with your userId embedded in the memo field. Sign and send — no form, no card, no KYC." />
//               <FlowStep num="02" icon="⬡" accent="green" title="Indexer detects payment" body="A Node.js indexer polls Solana RPC every 2 seconds. Confirmed transaction parsed, memo decoded, SOL converted to USD at real-time price, balance credited." />
//               <FlowStep num="03" icon="▣" accent="blue" title="Storage provisioned instantly" body="BullMQ job queued → worker creates R2 bucket + scoped API token via Cloudflare API. Credentials encrypted AES-256-GCM, delivered to your dashboard." />
//             </div>
//           </Reveal>

//         </div>
//       </section >

//       {/* ── WHY SOLANA ── */}
//       <section section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }
//       }>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>Why Solana</p>
//             <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.5px', color: '#fff', marginBottom: 48 }}>The only chain fast enough<br />for infrastructure payments.</h2>
//           </Reveal>
//           <Reveal delay={100}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
//               {[
//                 { icon: '⚡', title: '400ms finality', body: 'Solana confirms transactions faster than a credit card swipe. Users fund and access storage in the same breath — no waiting for multiple block confirmations.' },
//                 { icon: '◈', title: '$0.00025 per transaction', body: 'Micro top-ups are practical on Solana. A $5 top-up with a fraction-of-cent fee makes sense. On Ethereum, gas would exceed the top-up itself.' },
//                 { icon: '✉', title: 'Memo program for routing', body: "Solana's native memo program embeds a user ID in every transaction — zero off-chain reconciliation, no unique deposit addresses needed." },
//                 { icon: '◉', title: 'Consumer wallets already exist', body: 'Phantom and Solflare are on hundreds of millions of phones in India. The user already has a wallet. SolStore is one tap away.' },
//               ].map((item, i) => (
//                 <Card3D key={i} className="p-6 rounded-xl flex gap-4"
//                   style={{ background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'default' } as any}>
//                   <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
//                   <div>
//                     <h3 style={{ fontWeight: 500, color: '#fff', fontSize: 15, marginBottom: 6, fontFamily: 'DM Sans, sans-serif' }}>{item.title}</h3>
//                     <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>{item.body}</p>
//                   </div>
//                 </Card3D>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section >

//       {/* ── MARKET ── */}
//       {/* < section id="market" style={{ padding: '100px 24px', background: 'rgba(10,10,16,1)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <div style={{ textAlign: 'center', marginBottom: 48 }}>
//               <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>Market Opportunity</p>
//               <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.5px', color: '#fff' }}>A massive underserved market,<br />hiding in plain sight.</h2>
//             </div>
//           </Reveal>
//           <Reveal delay={100}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
//               <MarketCard value="450M+" color="#14F195" label="Debit-only users in India" sub="Developers, students, and founders who cannot access AWS/GCP today due to card restrictions. All are potential SolStore users." />
//               <MarketCard value="$110B" color="#9945FF" label="Global cloud storage market" sub="Even 0.001% of this market with crypto-native payments represents a significant, defensible revenue stream at meaningful margin." />
//               <MarketCard value="5M+" color="#00C2FF" label="Active Solana wallet holders in India" sub="A ready, self-selected audience that already pays for products on-chain today — perfectly positioned for SolStore." />
//               <MarketCard value="$0" color="#14F195" label="Direct competitors" sub="No product today bridges permissionless Solana payments with real cloud storage provisioning. SolStore has first-mover advantage." />
//               <MarketCard value="~40%" color="#9945FF" label="Gross margin potential" sub="Cloudflare R2 wholesale pricing. SolStore marks up moderately for the access layer, targeting 35–45% gross margin at scale." />
//               <MarketCard value="Payments" color="#00C2FF" label="Aligned with Superteam themes" sub="Directly addresses Payments/Stablecoins and Consumer Apps — bringing Solana to net-new users who've never touched DeFi." />
//             </div>
//           </Reveal>
//         </div>
//       </section > */}

//       {/* ── PROOF OF WORK ── */}
//       < section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>Proof of Work</p>
//             <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.5px', color: '#fff', marginBottom: 8 }}>Built in public.<br />Validated by real developers.</h2>
//             <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 500, lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans, sans-serif', marginBottom: 40 }}>Not a pitch deck. The architecture is complete, the problem is personally validated, and the build is live.</p>
//           </Reveal>
//           <Reveal delay={100}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
//               {[
//                 { title: 'Full 4-layer architecture designed', body: 'Frontend → Indexer → Backend → Storage fully spec\'d with security model, DB schema, and complete API surface. Not a concept.' },
//                 { title: 'Solana payment indexer live', body: 'Real-time polling via getSignaturesForAddress, memo parsing, idempotency via signature deduplication — working on devnet.' },
//                 { title: 'Cloudflare R2 provisioner built', body: 'Per-user bucket creation + scoped API token provisioning confirmed working. Credentials encrypted AES-256-GCM at rest.' },
//                 { title: 'Problem personally validated', body: 'Built by someone who personally hit the AWS card wall. Validated with 20+ developer peers in India — 100% confirmed the same barrier.' },
//               ].map((item, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 22px', borderRadius: 14, background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s', cursor: 'default' }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,241,149,0.25)' }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}>
//                   <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#14F195', flexShrink: 0 }}>✓</div>
//                   <div>
//                     <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 5 }}>{item.title}</div>
//                     <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>{item.body}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section >

//       {/* ── ROADMAP ── */}
//       < section id="roadmap" style={{ padding: '100px 24px', background: 'rgba(10,10,16,1)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <div style={{ textAlign: 'center', marginBottom: 48 }}>
//               <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#9945FF', marginBottom: 14, fontFamily: 'DM Sans, sans-serif' }}>Roadmap</p>
//               <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(28px,4vw,50px)', letterSpacing: '-1.5px', color: '#fff' }}>0 to 1 in 6 months.</h2>
//             </div>
//           </Reveal>
//           <Reveal delay={100}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'rgba(255,255,255,0.06)', gap: 1, borderRadius: 18, overflow: 'hidden' }}>
//               <RoadmapPhase tag="Month 1–2" tagColor="green" phase="Foundation" period="MVP Launch" active items={['Solana tx indexer live', 'R2 auto-provisioner', 'Basic user dashboard', '10 beta users onboarded']} />
//               <RoadmapPhase tag="Month 3–4" tagColor="purple" phase="Scale" period="Public Launch" items={['Usage billing + auto-suspend', 'SOL price oracle', 'S3-compatible API layer', '100 active users']} />
//               <RoadmapPhase tag="Month 5" tagColor="purple" phase="Expand" period="Product Growth" items={['USDC stablecoin support', 'Compute (EC2-equivalent)', 'Referral program', '500 active users']} />
//               <RoadmapPhase tag="Month 6" tagColor="gray" phase="Sustain" period="Revenue Milestone" items={['$2,000 MRR target', 'Open-source indexer', 'Superteam updates', 'Series A prep']} />
//             </div>
//           </Reveal>
//         </div>
//       </section >

//       {/* ── GRANT CTA ── */}
//       < section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto' }}>
//           <Reveal>
//             <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, padding: '72px 64px', textAlign: 'center', background: 'rgba(19,19,31,0.9)', border: '1px solid rgba(153,69,255,0.35)' }}>
//               {/* Glow */}
//               <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(153,69,255,0.1), transparent 65%)', pointerEvents: 'none' }} />

//               {/* Rotating border accent */}
//               <div style={{ position: 'absolute', top: -1, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, #9945FF, #14F195, transparent)', animation: 'shimmer 3s linear infinite', backgroundSize: '200% auto' }} />

//               <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#14F195', marginBottom: 20, fontFamily: 'DM Sans, sans-serif' }}>
//                 SolStore
//               </p>

//               <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(56px,9vw,88px)', letterSpacing: '-4px', lineHeight: 1, background: 'linear-gradient(135deg,#14F195,#9945FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8 }}>$10,000</div>
//               <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', marginBottom: 36 }}>Requested grant — 6 months to MVP, public launch, and $2K MRR</p>

//               <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
//                 {[
//                   { label: 'Month 1–2', desc: 'Indexer + R2 provisioner build' },
//                   { label: 'Month 3–4', desc: 'Dashboard, billing, public launch' },
//                   { label: 'Month 5–6', desc: 'Scale, compute, $2K MRR milestone' },
//                 ].map(u => (
//                   <div key={u.label} style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(26,26,42,1)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
//                     <strong style={{ color: '#fff', fontWeight: 500 }}>{u.label}</strong> — {u.desc}
//                   </div>
//                 ))}
//               </div>

//               <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif' }}>
//                 SolStore sits squarely in Superteam's focus: Payments and Consumer Apps. It brings Solana to net-new users — students and developers using it purely because it unlocks cloud access they couldn't get any other way.
//               </p>

//               <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
//                 <a href="https://earn.superteam.fun" target="_blank" rel="noreferrer"
//                   style={{ padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg,#9945FF,#7233cc)', color: '#fff', fontWeight: 600, fontSize: 15, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 0 30px rgba(153,69,255,0.4)' }}>
//                   Apply on Superteam Earn →
//                 </a>
//                 <GlowButton to="/register" variant="ghost">Start building with SolStore</GlowButton>
//               </div>
//             </div>
//           </Reveal>
//         </div>
//       </section >

//       {/* ── FOOTER ── */}
//       < footer style={{ padding: '44px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
//         <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
//               <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#9945FF,#14F195)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 900, color: '#000', fontSize: 12 }}>S</div>
//               <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.5px' }}>SolStore</span>
//             </div>
//             <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans, sans-serif' }}>Permissionless cloud storage on Solana. Built for developers</p>
//           </div>
//           <div style={{ display: 'flex', gap: 24 }}>
//             {[['#problem', 'Problem'], ['#how', 'Architecture'], ['#market', 'Market'], ['#roadmap', 'Roadmap']].map(([href, label]) => (
//               <a key={href} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.2s' }}
//                 onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
//                 onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}>{label}</a>
//             ))}
//           </div>
//         </div>
//       </footer >

//     </div >
//   )
// }

// // ── ParticleCanvas (inline for self-containment) ──────────────────────────
// function ParticleCanvas() {
//   const ref = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = ref.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     if (!ctx) return

//     let raf: number
//     let W = window.innerWidth, H = window.innerHeight
//     canvas.width = W; canvas.height = H

//     const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H }
//     window.addEventListener('resize', onResize)

//     const COLORS = ['#9945FF', '#14F195', '#00C2FF']
//     const N = 100

//     type Dot = { bx: number; by: number; bz: number; s: number; c: string }
//     const dots: Dot[] = Array.from({ length: N }, () => {
//       const theta = Math.random() * Math.PI * 2
//       const phi = Math.acos(2 * Math.random() - 1)
//       const r = 160 + Math.random() * 100
//       return { bx: r * Math.sin(phi) * Math.cos(theta), by: r * Math.sin(phi) * Math.sin(theta), bz: r * Math.cos(phi), s: Math.random() * 1.5 + 0.5, c: COLORS[Math.floor(Math.random() * COLORS.length)] }
//     })

//     let mx = 0, my = 0
//     const onMove = (e: MouseEvent) => { mx = (e.clientX - W / 2) / W; my = (e.clientY - H / 2) / H }
//     window.addEventListener('mousemove', onMove)

//     let t = 0
//     const proj = (x: number, y: number, z: number) => { const f = 500 / (500 + z); return { px: x * f + W / 2, py: y * f + H / 2, f } }
//     const rY = (x: number, z: number, a: number) => ({ rx: x * Math.cos(a) + z * Math.sin(a), rz: -x * Math.sin(a) + z * Math.cos(a) })
//     const rX = (y: number, z: number, a: number) => ({ ry: y * Math.cos(a) - z * Math.sin(a), rz: y * Math.sin(a) + z * Math.cos(a) })

//     const tick = () => {
//       ctx.clearRect(0, 0, W, H); t += 0.003
//       const pts = dots.map(d => {
//         let x = d.bx + Math.sin(t + d.bx * 0.005) * 8
//         let y = d.by + Math.cos(t * 0.8 + d.by * 0.005) * 8
//         let z = d.bz + Math.sin(t * 0.6 + d.bz * 0.005) * 8
//         const r1 = rY(x, z, t * 0.18 + mx * 0.9); x = r1.rx; z = r1.rz
//         const r2 = rX(y, z, t * 0.12 + my * 0.9); y = r2.ry; z = r2.rz
//         return { ...proj(x, y, z), c: d.c, s: d.s, z }
//       }).sort((a, b) => a.z - b.z)

//       for (let i = 0; i < pts.length; i++) {
//         for (let j = i + 1; j < pts.length; j++) {
//           const dx = pts[i].px - pts[j].px, dy = pts[i].py - pts[j].py
//           const dist = Math.sqrt(dx * dx + dy * dy)
//           if (dist < 85) { ctx.beginPath(); ctx.moveTo(pts[i].px, pts[i].py); ctx.lineTo(pts[j].px, pts[j].py); ctx.strokeStyle = `rgba(153,69,255,${(1 - dist / 85) * 0.12})`; ctx.lineWidth = 0.5; ctx.stroke() }
//         }
//       }
//       pts.forEach(p => {
//         const sz = p.s * p.f * 2; const alpha = Math.max(0.15, (p.z + 300) / 600)
//         const g = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, sz * 2.5)
//         g.addColorStop(0, p.c + Math.floor(alpha * 255).toString(16).padStart(2, '0'))
//         g.addColorStop(1, p.c + '00')
//         ctx.beginPath(); ctx.arc(p.px, p.py, sz, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
//       })
//       raf = requestAnimationFrame(tick)
//     }
//     tick()
//     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove) }
//   }, [])

//   return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.6 }} />
// }