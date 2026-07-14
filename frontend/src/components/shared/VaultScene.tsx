import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

/**
 * Interactive CSS-3D scene: an isometric stack of storage "plates" that
 * tilts toward the pointer, with data chips floating at different depths.
 * Transform/opacity only — no WebGL, no layout-triggering animation.
 */

const PLATES = [0, 1, 2, 3]
const PLATE_GAP = 52

const chips = [
  {
    label: 'payment confirmed',
    value: '0.42 SOL',
    className: 'left-[-4%] top-[12%]',
    depth: 26,
    delay: 0,
  },
  {
    label: 'bucket provisioned',
    value: 'r2 · apac-south',
    className: 'right-[-6%] top-[34%]',
    depth: 42,
    delay: 1.2,
  },
  {
    label: 'PUT /assets/build.tar',
    value: '4.2 MB · 201',
    className: 'left-[2%] bottom-[16%]',
    depth: 34,
    delay: 2.1,
  },
]

const VaultScene = () => {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 110,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 110,
    damping: 18,
  })

  // Parallax for chips (screen space, scaled per-chip by depth)
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-1, 1]), {
    stiffness: 90,
    damping: 20,
  })
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-1, 1]), {
    stiffness: 90,
    damping: 20,
  })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className='relative mx-auto flex h-[400px] w-full max-w-[520px] items-center justify-center md:h-[540px]'
      style={{ perspective: 1400 }}
      aria-hidden
    >
      {/* Ground glow */}
      <div className='absolute bottom-[6%] left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-[100%] bg-accent/10 blur-[70px]' />

      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className='relative h-[300px] w-[300px] md:h-[360px] md:w-[360px]'
      >
        {/* Isometric base orientation */}
        <div
          className='absolute inset-0'
          style={{
            transform: 'rotateX(56deg) rotateZ(-42deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {PLATES.map((i) => {
            const isTop = i === PLATES.length - 1
            return (
              <div
                key={i}
                className='absolute inset-0 rounded-[28px] border'
                style={{
                  transform: `translateZ(${i * PLATE_GAP}px)`,
                  transformStyle: 'preserve-3d',
                  background: isTop
                    ? 'linear-gradient(135deg, rgba(20,30,26,0.95), rgba(10,16,14,0.98))'
                    : 'linear-gradient(135deg, rgba(16,24,21,0.85), rgba(8,13,11,0.92))',
                  borderColor: isTop
                    ? 'rgba(52,211,153,0.35)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: isTop
                    ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 50px rgba(52,211,153,0.12)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Plate detail: activity LEDs on the near edge */}
                <div className='absolute bottom-4 left-4 flex gap-2'>
                  <span
                    className='h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot'
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                  <span className='h-1.5 w-1.5 rounded-full bg-white/15' />
                  <span className='h-1.5 w-1.5 rounded-full bg-white/15' />
                </div>

                {isTop && (
                  <>
                    {/* Grid etched into the top plate */}
                    <div
                      className='absolute inset-0 rounded-[28px] opacity-40'
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(52,211,153,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.12) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                      }}
                    />
                    {/* Glowing core */}
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { opacity: [0.55, 1, 0.55], scale: [1, 1.06, 1] }
                      }
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                      className='absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full'
                      style={{
                        background:
                          'radial-gradient(circle, rgba(52,211,153,0.55), rgba(52,211,153,0.08) 60%, transparent 72%)',
                        filter: 'blur(2px)',
                      }}
                    />
                  </>
                )}
              </div>
            )
          })}

          {/* Data pulses travelling between plates */}
          {PLATES.slice(0, -1).map((i) => (
            <motion.div
              key={`pulse-${i}`}
              animate={prefersReducedMotion ? undefined : { opacity: [0, 0.8, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: i * 0.9,
                ease: 'easeInOut',
              }}
              className='absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-xl'
              style={{ transform: `translate(-50%, -50%) translateZ(${i * PLATE_GAP + PLATE_GAP / 2}px)` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Floating telemetry chips — screen space, parallax by depth */}
      {chips.map((chip) => (
        <TelemetryChip key={chip.label} chip={chip} px={px} py={py} />
      ))}
    </div>
  )
}

function TelemetryChip({
  chip,
  px,
  py,
}: {
  chip: (typeof chips)[number]
  px: MotionValue<number>
  py: MotionValue<number>
}) {
  const x = useTransform(px, (v) => v * chip.depth)
  const y = useTransform(py, (v) => v * chip.depth)

  return (
    <motion.div style={{ x, y }} className={`absolute ${chip.className}`}>
      <div
        className='animate-float-soft rounded-2xl border border-white/10 bg-dark-surface/90 px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)]'
        style={{ animationDelay: `${chip.delay}s` }}
      >
        <div className='flex items-center gap-2'>
          <span className='h-1.5 w-1.5 rounded-full bg-accent' />
          <span className='font-mono text-[11px] text-white/50'>{chip.label}</span>
        </div>
        <p className='tabular mt-1 font-mono text-sm font-medium text-white'>
          {chip.value}
        </p>
      </div>
    </motion.div>
  )
}

export default VaultScene
