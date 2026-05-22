import { cn } from '../../lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return <div className={cn('w-5 h-5 border-2 border-white/20 border-t-sol-purple rounded-full animate-spin', className)} />
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner className="w-8 h-8" />
        <p className="text-white/40 text-sm font-body">Loading...</p>
      </div>
    </div>
  )
}
