import { Worker, type Job } from "bullmq";
import { getWorkerConnection } from "./redis.connection";
import { JOB_NAMES } from "./queue.types";
import type {
  ProvisionStorageJob,
  SuspendStorageJob,
  ReactivateStorageJob,
  RefreshUsageJob,
  SendLowBalanceEmailJob,
} from "./queue.types";
import {
  provisionStorage,
  suspendStorage,
  reactivateStorage,
} from "../services/provisioner.service";
import { getStorageProvider } from "../storage";
import { updateBucketStorage } from "../db/queries";
import { recordUsageSnapshot } from "../services/billing/billing.queries";
import { checkAndNotifyLowBalance } from "../services/billing/billing.notifications";
import { prisma } from "../db/client";

async function processJob(job: Job): Promise<void> {
  console.log(
    `[worker] Processing: ${job.name} | id: ${job.id} | attempt: ${job.attemptsMade + 1}`,
  );

  switch (job.name) {
    case JOB_NAMES.PROVISION_STORAGE: {
      const data = job.data as ProvisionStorageJob;
      await provisionStorage(data);
      break;
    }
    case JOB_NAMES.SUSPEND_STORAGE: {
      const data = job.data as SuspendStorageJob;
      await suspendStorage(data.userId);
      break;
    }
    case JOB_NAMES.REACTIVATE_STORAGE: {
      const data = job.data as ReactivateStorageJob;
      await reactivateStorage(data.userId);
      break;
    }
    case JOB_NAMES.REFRESH_USAGE: {
      const data = job.data as RefreshUsageJob;
      const provider = getStorageProvider();
      const usage = await provider.getUsageBytes(data.bucketName);
      await updateBucketStorage(data.userId, usage.storageBytes);
      await recordUsageSnapshot({
        userId: data.userId,
        storageBytes: usage.storageBytes,
        objectCount: usage.objectCount,
      });
      break;
    }
    case JOB_NAMES.SEND_LOW_BAL_EMAIL: {
      const data = job.data as SendLowBalanceEmailJob;
      await checkAndNotifyLowBalance(
        data.userId,
        data.balanceUsd,
        data.userEmail,
      );
      break;
    }
    default:
      throw new Error(`Unknown job type: ${job.name}`);
  }

  console.log(`[worker] ✅ Completed: ${job.name} (${job.id})`);
}

let _worker: Worker | null = null;

export function startWorker(): Worker {
  if (_worker) return _worker;

  _worker = new Worker("storage", processJob, {
    connection: getWorkerConnection(),
    concurrency: 3,
  });

  _worker.on("completed", (job) =>
    console.log(`[worker] Done: ${job.name} (${job.id})`),
  );
  _worker.on("failed", (job, err) => {
    console.error(
      `[worker] Failed: ${job?.name} (${job?.id}) — ${err.message}`,
    );
    if (job && job.attemptsMade >= (job.opts?.attempts ?? 1)) {
      logFailedJob(job, err).catch(console.error);
    }
  });
  _worker.on("error", (err) => console.error("[worker] Error:", err.message));

  console.log("⚙️  Queue worker started (concurrency: 3)");
  return _worker;
}

export async function stopWorker(): Promise<void> {
  if (_worker) {
    await _worker.close();
    _worker = null;
  }
}

async function logFailedJob(job: Job, err: Error): Promise<void> {
  const key = `failed_job:${job.id}:${Date.now()}`;
  await prisma.indexerState
    .upsert({
      where: { key },
      create: {
        key,
        value: JSON.stringify({
          jobName: job.name,
          jobId: job.id,
          error: err.message,
          failedAt: new Date().toISOString(),
        }),
      },
      update: { value: "duplicate" },
    })
    .catch(() => {});
}
