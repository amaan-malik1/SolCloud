import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

interface TiltProps {
  children: React.ReactNode
  className?: string
  /** Max tilt in degrees */
  strength?: number
}

/** Pointer-tracked 3D tilt wrapper. Transform-only, disabled for reduced motion. */
export function Tilt({ children, className, strength = 5 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [strength, -strength]), {
    stiffness: 180,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-strength, strength]), {
    stiffness: 180,
    damping: 22,
  })

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === 'touch') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className='h-full'
      >
        {children}
      </motion.div>
    </div>
  )
}
