import { runBillingCycle, type BillingRunResult } from './billing.engine'

let schedulerHandle: NodeJS.Timeout | null = null
let isRunning = false
let lastRunAt: Date | null = null
let lastRunResult: BillingRunResult | null = null

function msUntilMidnightUTC(): number {
  const midnight = new Date()
  midnight.setUTCHours(24, 0, 0, 0)
  return midnight.getTime() - Date.now()
}

async function runAndReschedule(): Promise<void> {
  if (isRunning) return
  isRunning = true
  try {
    lastRunResult = await runBillingCycle()
    lastRunAt = new Date()
  } catch (err) {
    console.error('[billing-scheduler] Billing cycle failed:', err)
  } finally {
    isRunning = false
  }
  const msUntilNext = msUntilMidnightUTC()
  console.log(`[billing-scheduler] Next run in ${Math.round(msUntilNext / 1000 / 60)} minutes`)
  schedulerHandle = setTimeout(runAndReschedule, msUntilNext)
}

export function startBillingScheduler(): void {
  if (schedulerHandle) return
  const hoursUntil = (msUntilMidnightUTC() / 1000 / 60 / 60).toFixed(1)
  console.log(`💰 Billing scheduler started — first run in ${hoursUntil} hours`)
  schedulerHandle = setTimeout(runAndReschedule, msUntilMidnightUTC())
}

export function stopBillingScheduler(): void {
  if (schedulerHandle) { clearTimeout(schedulerHandle); schedulerHandle = null }
}

export function getBillingSchedulerStatus() {
  return {
    running: !!schedulerHandle,
    isProcessing: isRunning,
    lastRunAt: lastRunAt?.toISOString() ?? null,
    nextRunAt: schedulerHandle ? new Date(Date.now() + msUntilMidnightUTC()).toISOString() : null,
    lastRunResult,
  }
}

export async function triggerBillingNow() {
  if (isRunning) throw new Error('Billing cycle already in progress')
  return runBillingCycle()
}
