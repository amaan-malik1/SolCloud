import { runBillingCycle as runPaygBillingCycle } from './billing.engine'
import { processSubscriptionRenewals } from './subscription.service'

let _schedulerStarted = false
let _lastRunAt: Date | null = null
let _nextRunAt: Date | null = null
let _timer: ReturnType<typeof setTimeout> | null = null  // ← fixes NodeJS.Timeout error

function msUntilNextMidnightUtc(): number {
  const now = new Date()
  const next = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ))
  return next.getTime() - now.getTime()
}

async function runDailyCycle(): Promise<{
  paygResult: any
  subscriptionResult: { processed: number; charged: number; downgraded: number }
}> {
  console.log('[billing] Running daily billing cycle...')

  // 1. Subscription renewals first
  const subscriptionResult = await processSubscriptionRenewals()
  console.log(
    `[billing] Subscription renewals — processed: ${subscriptionResult.processed}, ` +
    `charged: ${subscriptionResult.charged}, downgraded: ${subscriptionResult.downgraded}`
  )

  // 2. PAYG usage billing
  const paygResult = await runPaygBillingCycle()  // ← correct export name
  console.log(`[billing] PAYG billing complete`)

  _lastRunAt = new Date()
  return { paygResult, subscriptionResult }
}

function scheduleNext(): void {
  const delay = msUntilNextMidnightUtc()
  _nextRunAt = new Date(Date.now() + delay)

  _timer = setTimeout(async () => {
    try {
      await runDailyCycle()
    } catch (err: any) {
      console.error('[billing] Scheduled run failed:', err.message)
    }
    scheduleNext()
  }, delay)
}

export function startBillingScheduler(): void {
  if (_schedulerStarted) return
  _schedulerStarted = true

  const delay = msUntilNextMidnightUtc()
  const hours = (delay / (1000 * 60 * 60)).toFixed(1)
  console.log(`💰 Billing scheduler started — first run in ${hours} hours`)

  scheduleNext()
}

export function getBillingSchedulerStatus() {
  return {
    started: _schedulerStarted,
    lastRunAt: _lastRunAt,
    nextRunAt: _nextRunAt,
  }
}

export async function triggerBillingNow() {
  return runDailyCycle()
}