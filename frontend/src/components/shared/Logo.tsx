import { cn } from '../../lib/utils'

interface LogoProps { size?: 'sm' | 'md' | 'lg'; className?: string }

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = {
    sm: { mark: 'h-7 w-7 rounded-[8px]', glyph: 'h-3.5 w-3.5', text: 'text-base' },
    md: { mark: 'h-8 w-8 rounded-[9px]', glyph: 'h-4 w-4', text: 'text-lg' },
    lg: { mark: 'h-10 w-10 rounded-[11px]', glyph: 'h-5 w-5', text: 'text-2xl' },
  }
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex items-center justify-center bg-accent text-accent-ink shadow-[0_0_18px_rgba(52,211,153,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]',
          sizes[size].mark,
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className={sizes[size].glyph} aria-hidden>
          <path
            d="M5 8.4C5 6.5 6.5 5 8.4 5h9.1a1.5 1.5 0 0 1 0 3H8.4a.4.4 0 0 0-.14.78l8.3 3.1A3.4 3.4 0 0 1 15.6 19H6.5a1.5 1.5 0 0 1 0-3h9.1a.4.4 0 0 0 .14-.78l-8.3-3.1A3.4 3.4 0 0 1 5 8.4Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className={cn('font-semibold tracking-tight text-white', sizes[size].text)}>
        SolStore
      </span>
    </div>
  )
}
