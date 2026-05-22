import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Step { label: string; sub: string }

export function StepIndicator({ steps, currentStep, className }: { steps: Step[]; currentStep: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {steps.map((step, i) => {
        const isDone = i < currentStep, isActive = i === currentStep, isLast = i === steps.length - 1
        return (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center border text-xs font-medium transition-all duration-300 flex-shrink-0',
                isDone ? 'bg-sol-green/20 border-sol-green/40 text-sol-green' : isActive ? 'bg-sol-purple/20 border-sol-purple/50 text-sol-purple' : 'bg-white/5 border-white/10 text-white/25')}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
              </div>
              {!isLast && <div className={cn('w-px flex-1 min-h-[20px] my-1 transition-all duration-500', isDone ? 'bg-sol-green/30' : 'bg-white/8')} />}
            </div>
            <div className="pb-5">
              <p className={cn('text-sm font-medium transition-colors duration-300', isDone ? 'text-sol-green' : isActive ? 'text-white' : 'text-white/25')}>{step.label}</p>
              <p className={cn('text-xs font-body mt-0.5 transition-colors duration-300', isActive ? 'text-white/45' : 'text-white/20')}>{step.sub}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
