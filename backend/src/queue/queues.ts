import { Queue } from "bullmq";
import { getProducerConnection } from "./redis.connection";
import { JOB_NAMES } from "./queue.types";
import type {
  ProvisionStorageJob,
  SuspendStorageJob,
  ReactivateStorageJob,
  RefreshUsageJob,
  SendLowBalanceEmailJob,
} from "./queue.types";

const DEFAULT_JOB_OPTIONS = {
  attempts: 5,
  backoff: { type: "exponential" as const, delay: 2000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 200 },
};

let _storageQueue: Queue | null = null;

export function getStorageQueue(): Queue {
  if (_storageQueue) return _storageQueue;
  _storageQueue = new Queue("storage", {
    connection: getProducerConnection(),
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  return _storageQueue;
}

export async function queueProvisionStorage(
  data: ProvisionStorageJob,
): Promise<void> {
  await getStorageQueue().add(JOB_NAMES.PROVISION_STORAGE, data, {
    jobId: `provision_${data.userId}_${Date.now()}`,
    ...DEFAULT_JOB_OPTIONS,
  });
  console.log(`[queue] Queued provision for user ${data.userId.slice(0, 8)}`);
}

export async function queueSuspendStorage(
  data: SuspendStorageJob,
): Promise<void> {
  await getStorageQueue().add(JOB_NAMES.SUSPEND_STORAGE, data, {
    jobId: `suspend_${data.userId}`,
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });
}

export async function queueReactivateStorage(
  data: ReactivateStorageJob,
): Promise<void> {
  await getStorageQueue().add(JOB_NAMES.REACTIVATE_STORAGE, data, {
    jobId: `reactivate_${data.userId}`,
    ...DEFAULT_JOB_OPTIONS,
  });
}

export async function queueRefreshUsage(data: RefreshUsageJob): Promise<void> {
  await getStorageQueue().add(JOB_NAMES.REFRESH_USAGE, data, {
    attempts: 2,
    backoff: { type: "fixed", delay: 5000 },
  });
}

export async function queueSendLowBalanceEmail(
  data: SendLowBalanceEmailJob,
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  await getStorageQueue().add(JOB_NAMES.SEND_LOW_BAL_EMAIL, data, {
    jobId: `lowbal_${data.userId}_${today}`,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}

export async function getQueueStats() {
  const queue = getStorageQueue();
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);
  return { waiting, active, completed, failed, delayed };
}
