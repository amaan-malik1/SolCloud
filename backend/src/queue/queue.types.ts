export const JOB_NAMES = {
  PROVISION_STORAGE: "provision_storage",
  SUSPEND_STORAGE: "suspend_storage",
  REACTIVATE_STORAGE: "reactivate_storage",
  REFRESH_USAGE: "refresh_usage",
  SEND_LOW_BAL_EMAIL: "send_low_balance_email",
} as const;

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES];

export interface ProvisionStorageJob {
  userId: string;
  txSignature: string;
  solAmount: number;
  usdAmount: number;
  solPriceUsd: number;
}
export interface SuspendStorageJob {
  userId: string;
  reason: "zero_balance" | "manual" | "abuse";
}
export interface ReactivateStorageJob {
  userId: string;
}
export interface RefreshUsageJob {
  userId: string;
  bucketName: string;
}
export interface SendLowBalanceEmailJob {
  userId: string;
  userEmail: string;
  balanceUsd: number;
  thresholdUsd: number;
}
