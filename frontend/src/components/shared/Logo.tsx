import { cn } from '../../lib/utils'

interface LogoProps { size?: 'sm' | 'md' | 'lg'; className?: string }

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = { sm: { mark: 'w-7 h-7 text-xs', text: 'text-base' }, md: { mark: 'w-8 h-8 text-sm', text: 'text-lg' }, lg: { mark: 'w-10 h-10 text-base', text: 'text-2xl' } }
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('rounded-lg sol-gradient flex items-center justify-center text-black font-display font-black flex-shrink-0', sizes[size].mark)}>S</div>
      <span className={cn('font-display font-bold tracking-tight text-white', sizes[size].text)}>SolStore</span>
    </div>
  )
}
