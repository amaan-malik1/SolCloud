import { prisma } from "../db/client";
import { getStorageProvider } from "../storage";
import { updateBucketStorage } from "../db/queries";
import { recordUsageSnapshot } from "./billing/billing.queries";

const SYNC_INTERVAL_MS = 30 * 60 * 1000;
let syncHandle: NodeJS.Timeout | null = null;
let isSyncing = false;
let lastSyncAt: Date | null = null;

export async function syncBucketUsage(
  userId: string,
  bucketName: string,
): Promise<{ storageBytes: number; objectCount: number }> {
  const provider = getStorageProvider();
  const usage = await provider.getUsageBytes(bucketName);
  await updateBucketStorage(userId, usage.storageBytes);
  await recordUsageSnapshot({
    userId,
    storageBytes: usage.storageBytes,
    objectCount: usage.objectCount,
  });
  return usage;
}

async function syncAllBuckets(): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const activeBuckets = await prisma.bucket.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true, bucketName: true },
    });
    if (activeBuckets.length === 0) return;
    console.log(`[usage-sync] Syncing ${activeBuckets.length} buckets...`);
    for (const bucket of activeBuckets) {
      try {
        await syncBucketUsage(bucket.userId, bucket.bucketName);
      } catch (err) {
        console.error(`[usage-sync] Failed for ${bucket.bucketName}:`, err);
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    lastSyncAt = new Date();
    console.log(`[usage-sync] Complete`);
  } finally {
    isSyncing = false;
  }
}

export function startUsageSync(): void {
  if (syncHandle) return;
  console.log(
    `📊 Usage sync started — interval: ${SYNC_INTERVAL_MS / 60000} minutes`,
  );
  syncAllBuckets().catch(console.error);
  syncHandle = setInterval(
    () => syncAllBuckets().catch(console.error),
    SYNC_INTERVAL_MS,
  );
}

export function stopUsageSync(): void {
  if (syncHandle) {
    clearInterval(syncHandle);
    syncHandle = null;
  }
}

export function getUsageSyncStatus() {
  return {
    running: !!syncHandle,
    isSyncing,
    lastSyncAt: lastSyncAt?.toISOString() ?? null,
    nextSyncAt:
      syncHandle && lastSyncAt
        ? new Date(lastSyncAt.getTime() + SYNC_INTERVAL_MS).toISOString()
        : null,
    intervalMinutes: SYNC_INTERVAL_MS / 60000,
  };
}
