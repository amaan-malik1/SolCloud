import { BILLING } from './billing.constants'

export interface BillingCalculation {
  storageBytes: number
  billableBytes: number
  gbUsed: number
  dailyCostUsd: number
  breakdown: { storageGb: number; storageRatePerDay: number; storageCostUsd: number }
}

export function calculateDailyBill(storageBytes: number): BillingCalculation {
  const safeBytes = Math.max(0, storageBytes)
  const billableBytes = Math.max(0, safeBytes - BILLING.FREE_TIER_STORAGE_BYTES)
  const gbUsed = billableBytes / BILLING.BYTES_PER_GB
  const storageCostUsd = gbUsed * BILLING.STORAGE_COST_PER_GB_PER_DAY
  const dailyCostUsd = storageCostUsd

  return {
    storageBytes: safeBytes,
    billableBytes,
    gbUsed,
    dailyCostUsd,
    breakdown: {
      storageGb: safeBytes / BILLING.BYTES_PER_GB,
      storageRatePerDay: BILLING.STORAGE_COST_PER_GB_PER_DAY,
      storageCostUsd,
    },
  }
}
