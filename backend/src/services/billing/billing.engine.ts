import { prisma } from "../../db/client";
import { getStorageProvider } from "../../storage";
import { updateBucketStorage } from "../../db/queries";
import { calculateDailyBill } from "./billing.calculator";
import { BILLING } from "./billing.constants";
import {
  recordBillingCharge,
  recordUsageSnapshot,
  getActiveBucketsWithUsers,
} from "./billing.queries";
import {
  queueSuspendStorage,
  queueSendLowBalanceEmail,
} from "../../queue/queues";

export interface BillingRunResult {
  processedUsers: number;
  totalCharged: number;
  suspendedUsers: number;
  skippedUsers: number;
  errors: string[];
  startedAt: Date;
  completedAt: Date;
}

export async function isInGracePeriod(userId: string): Promise<boolean> {
  const key = `grace:${userId}`;
  const row = await prisma.indexerState.findUnique({ where: { key } });
  if (!row) return false;
  const graceData = JSON.parse(row.value);
  return Date.now() < graceData.expiresAt;
}

export async function startGracePeriod(
  userId: string,
  userEmail: string,
): Promise<void> {
  const key = `grace:${userId}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  await prisma.indexerState.upsert({
    where: { key },
    create: { key, value: JSON.stringify({ expiresAt, userEmail }) },
    update: { value: JSON.stringify({ expiresAt, userEmail }) },
  });
  console.log(`[billing] Grace period started for ${userId.slice(0, 8)}`);
}

export async function clearGracePeriod(userId: string): Promise<void> {
  await prisma.indexerState.deleteMany({ where: { key: `grace:${userId}` } });
}

async function billUser(
  userId: string,
  bucketName: string,
  currentBalanceUsd: number,
  periodStart: Date,
  periodEnd: Date,
): Promise<{ charged: number; suspended: boolean; skipped: boolean }> {
  const provider = getStorageProvider();
  let usage = { storageBytes: 0, objectCount: 0 };

  try {
    usage = await provider.getUsageBytes(bucketName);
  } catch {
    const bucket = await prisma.bucket.findFirst({
      where: { bucketName },
      select: { storageBytes: true },
    });
    usage.storageBytes = Number(bucket?.storageBytes ?? 0);
  }

  await updateBucketStorage(userId, usage.storageBytes);
  await recordUsageSnapshot({
    userId,
    storageBytes: usage.storageBytes,
    objectCount: usage.objectCount,
  });

  const calc = calculateDailyBill(usage.storageBytes);

  if (calc.dailyCostUsd < BILLING.MIN_BILLABLE_AMOUNT) {
    return { charged: 0, suspended: false, skipped: true };
  }

  if (currentBalanceUsd <= BILLING.SUSPENSION_THRESHOLD) {
    const inGrace = await isInGracePeriod(userId);
    if (!inGrace) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (user) {
        await startGracePeriod(userId, user.email);
        await queueSendLowBalanceEmail({
          userId,
          userEmail: user.email,
          balanceUsd: 0,
          thresholdUsd: 0,
        });
      }
      return { charged: 0, suspended: false, skipped: false };
    }
    await queueSuspendStorage({ userId, reason: "zero_balance" });
    return { charged: 0, suspended: true, skipped: false };
  }

  const actualCharge = Math.min(calc.dailyCostUsd, currentBalanceUsd);
  await prisma.$executeRaw`UPDATE balances SET amount_usd = GREATEST(0, amount_usd - ${actualCharge}::numeric) WHERE user_id = ${userId}`;
  await recordBillingCharge({
    userId,
    amountUsd: actualCharge,
    storageBytes: usage.storageBytes,
    gbHours: calc.gbUsed * 24,
    periodStart,
    periodEnd,
  });

  const newBalance = currentBalanceUsd - actualCharge;
  if (newBalance <= 2) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (user)
      await queueSendLowBalanceEmail({
        userId,
        userEmail: user.email,
        balanceUsd: newBalance,
        thresholdUsd: 2,
      });
  }

  if (newBalance <= BILLING.SUSPENSION_THRESHOLD) {
    await queueSuspendStorage({ userId, reason: "zero_balance" });
    return { charged: actualCharge, suspended: true, skipped: false };
  }

  return { charged: actualCharge, suspended: false, skipped: false };
}

export async function runBillingCycle(): Promise<BillingRunResult> {
  const startedAt = new Date();
  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);

  console.log(`[billing] Starting billing cycle: ${startedAt.toISOString()}`);

  const result: BillingRunResult = {
    processedUsers: 0,
    totalCharged: 0,
    suspendedUsers: 0,
    skippedUsers: 0,
    errors: [],
    startedAt,
    completedAt: new Date(),
  };

  const activeBuckets = await getActiveBucketsWithUsers();
  console.log(`[billing] Found ${activeBuckets.length} active buckets`);

  for (const bucket of activeBuckets) {
    const balanceUsd = bucket.user.balance
      ? Number(bucket.user.balance.amountUsd)
      : 0;
    try {
      const { charged, suspended, skipped } = await billUser(
        bucket.userId,
        bucket.bucketName,
        balanceUsd,
        periodStart,
        periodEnd,
      );
      result.processedUsers++;
      result.totalCharged += charged;
      if (suspended) result.suspendedUsers++;
      if (skipped) result.skippedUsers++;
    } catch (err) {
      const msg = `User ${bucket.userId.slice(0, 8)}: ${err instanceof Error ? err.message : "Unknown"}`;
      console.error(`[billing] Error: ${msg}`);
      result.errors.push(msg);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  result.completedAt = new Date();
  console.log(
    `[billing] Cycle complete — Processed: ${result.processedUsers} | Charged: $${result.totalCharged.toFixed(6)} | Suspended: ${result.suspendedUsers}`,
  );
  return result;
}
