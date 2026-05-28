import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  credentialRateLimit,
  regenerateRateLimit,
} from "../middleware/rate.limit";
import {
  getDecryptedCredentials,
  logCredentialRotation,
  getRotationHistory,
} from "../services/credentials.service";
import { syncBucketUsage, getUsageSyncStatus } from "../services/usage.sync";
import { reactivateStorage } from "../services/provisioner.service";
import { getBucket } from "../db/queries";
import { prisma } from "../db/client";
import { isInGracePeriod } from "../services/billing/billing.engine";

const router = Router();

// Credentials
router.get(
  "/credentials",
  authMiddleware,
  credentialRateLimit,
  async (req: Request, res: Response) => {
    const result = await getDecryptedCredentials((req as any).user.userId);
    if ("error" in result) {
      const statusMap: Record<string, number> = {
        NO_BUCKET: 404,
        SUSPENDED: 403,
        DELETED: 410,
        NO_CREDENTIALS: 503,
        DECRYPT_FAILED: 500,
      };
      const messageMap: Record<string, string> = {
        NO_BUCKET: "No storage provisioned yet",
        SUSPENDED: "Storage suspended — top up your balance to reactivate",
        DELETED: "Storage has been deleted",
        NO_CREDENTIALS: "Credentials not yet generated",
        DECRYPT_FAILED: "Failed to retrieve credentials",
      };
      res
        .status(statusMap[result.error as any] ?? 500)
        .json({ error: messageMap[result.error as any], code: result.error });
      return;
    }
    res.json(result);
  },
);

// ─── Status ────────────────────────────────────────────────
router.get("/status", authMiddleware, async (req: Request, res: Response) => {
  try {
    const bucket = await getBucket((req as any).user.userId);
    res.json({
      hasStorage: !!bucket,
      status: bucket?.status ?? null,
      bucketName: bucket?.bucketName ?? null,
      storageBytes: bucket ? Number(bucket.storageBytes) : 0,
      provider: bucket?.provider ?? null,
      createdAt: bucket?.createdAt ?? null,
      updatedAt: bucket?.updatedAt ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch storage status" });
  }
});

// ─── Usage ─────────────────────────────────────────────────
router.get("/usage", authMiddleware, async (req: Request, res: Response) => {
  try {
    const bucket = await getBucket((req as any).user.userId);
    if (!bucket) {
      res.status(404).json({ error: "No bucket found" });
      return;
    }

    const snapshots = await prisma.usageSnapshot.findMany({
      where: { userId: (req as any).user.userId },
      orderBy: { recordedAt: "desc" },
      take: 7,
      select: { storageBytes: true, objectCount: true, recordedAt: true },
    });

    const FREE_TIER_BYTES = 10 * 1024 * 1024 * 1024;
    res.json({
      current: {
        storageBytes: Number(bucket.storageBytes),
        objectCount: snapshots[0]?.objectCount ?? 0,
        lastUpdated: bucket.updatedAt,
      },
      freeTierBytes: FREE_TIER_BYTES,
      billableBytes: Math.max(0, Number(bucket.storageBytes) - FREE_TIER_BYTES),
      usagePct: (Number(bucket.storageBytes) / FREE_TIER_BYTES) * 100,
      snapshots: snapshots.map((s) => ({
        storageBytes: Number(s.storageBytes),
        objectCount: s.objectCount,
        recordedAt: s.recordedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch usage data" });
  }
});

// ─── Usage history ─────────────────────────────────────────
router.get(
  "/usage/history",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const days = Math.min(parseInt(req.query.days as string) || 30, 90);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const snapshots = await prisma.usageSnapshot.findMany({
        where: { userId: (req as any).user.userId, recordedAt: { gte: since } },
        orderBy: { recordedAt: "asc" },
        select: { storageBytes: true, objectCount: true, recordedAt: true },
      });

      const byDay = new Map<string, (typeof snapshots)[0]>();
      for (const snap of snapshots) {
        const day = snap.recordedAt.toISOString().split("T")[0];
        byDay.set(day, snap);
      }

      const chartData = Array.from(byDay.entries()).map(([date, snap]) => ({
        date,
        storageBytes: Number(snap.storageBytes),
        storageGb: Number(snap.storageBytes) / 1024 ** 3,
        objectCount: snap.objectCount,
        recordedAt: snap.recordedAt,
      }));

      res.json({
        days,
        dataPoints: chartData.length,
        chart: chartData,
        summary: {
          maxBytes: chartData.length
            ? Math.max(...chartData.map((d) => d.storageBytes))
            : 0,
          minBytes: chartData.length
            ? Math.min(...chartData.map((d) => d.storageBytes))
            : 0,
          latestBytes: chartData.at(-1)?.storageBytes ?? 0,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch usage history" });
    }
  },
);

// ─── Daily cost ─────────────────────────────────────────────
router.get(
  "/usage/daily-cost",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const days = Math.min(parseInt(req.query.days as string) || 30, 90);
      const since = new Date();
      since.setDate(since.getDate() - days);

      const records = await prisma.billingRecord.findMany({
        where: { userId: (req as any).user.userId, createdAt: { gte: since } },
        orderBy: { periodStart: "asc" },
        select: {
          amountUsd: true,
          storageBytes: true,
          periodStart: true,
          periodEnd: true,
          createdAt: true,
        },
      });

      const chartData = records.map((r) => ({
        date: r.periodStart.toISOString().split("T")[0],
        amountUsd: Number(r.amountUsd),
        storageBytes: Number(r.storageBytes),
        periodStart: r.periodStart,
        periodEnd: r.periodEnd,
      }));

      const totalCost = chartData.reduce((sum, r) => sum + r.amountUsd, 0);
      res.json({
        days,
        chart: chartData,
        totalCost,
        avgDaily: chartData.length ? totalCost / chartData.length : 0,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch daily cost" });
    }
  },
);

// ─── Refresh usage ─────────────────────────────────────────
router.post(
  "/refresh-usage",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const bucket = await getBucket((req as any).user.userId);
      if (!bucket) {
        res.status(404).json({ error: "No bucket found" });
        return;
      }
      if (bucket.status !== "ACTIVE") {
        res.status(403).json({ error: "Bucket must be active" });
        return;
      }
      const usage = await syncBucketUsage(
        (req as any).user.userId,
        bucket.bucketName,
      );
      res.json({
        storageBytes: usage.storageBytes,
        objectCount: usage.objectCount,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to refresh usage" });
    }
  },
);

// ─── Balance ───────────────────────────────────────────────
router.get("/balance", authMiddleware, async (req: Request, res: Response) => {
  try {
    const balance = await prisma.balance.findUnique({
      where: { userId: (req as any).user.userId },
      select: { amountUsd: true, updatedAt: true },
    });
    res.json({
      amountUsd: balance ? Number(balance.amountUsd) : 0,
      updatedAt: balance?.updatedAt ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch balance" });
  }
});

// ─── Transactions ──────────────────────────────────────────
router.get(
  "/transactions",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId: (req as any).user.userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          txSignature: true,
          solAmount: true,
          usdAmount: true,
          solPriceUsd: true,
          status: true,
          createdAt: true,
        },
      });
      res.json({
        transactions: transactions.map((t) => ({
          ...t,
          solAmount: Number(t.solAmount),
          usdAmount: Number(t.usdAmount),
          solPriceUsd: Number(t.solPriceUsd),
        })),
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  },
);

// ─── Regenerate keys ───────────────────────────────────────
router.post(
  "/regenerate-keys",
  authMiddleware,
  regenerateRateLimit,
  async (req: Request, res: Response) => {
    try {
      const bucket = await getBucket((req as any).user.userId);
      if (!bucket) {
        res.status(404).json({ error: "No bucket found" });
        return;
      }
      if (bucket.status !== "ACTIVE") {
        res
          .status(403)
          .json({ error: "Bucket must be active to regenerate keys" });
        return;
      }

      await reactivateStorage((req as any).user.userId);
      await logCredentialRotation((req as any).user.userId, "manual", req.ip);

      const result = await getDecryptedCredentials((req as any).user.userId);
      if ("error" in result) {
        res.status(500).json({ error: "Failed to retrieve new credentials" });
        return;
      }

      res.json({
        message: "Keys regenerated successfully",
        credentials: result.credentials,
      });
    } catch (err) {
      console.error("[storage/regenerate-keys]", err);
      res.status(500).json({ error: "Failed to regenerate keys" });
    }
  },
);

// ─── Rotation history ──────────────────────────────────────
router.get(
  "/rotation-history",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const history = await getRotationHistory((req as any).user.userId);
      res.json({ history });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch rotation history" });
    }
  },
);

// ─── Sync status ───────────────────────────────────────────
router.get("/sync-status", authMiddleware, (_req, res) => {
  res.json(getUsageSyncStatus());
});

// ─── Suspension status ─────────────────────────────────────
router.get(
  "/suspension-status",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const bucket = await getBucket(userId);
      if (!bucket) {
        res.json({ status: "NO_BUCKET" });
        return;
      }

      const inGrace = await isInGracePeriod(userId);
      let graceExpiresAt: string | null = null;
      if (inGrace) {
        const row = await prisma.indexerState.findUnique({
          where: { key: `grace:${userId}` },
        });
        if (row) {
          const data = JSON.parse(row.value);
          graceExpiresAt = new Date(data.expiresAt).toISOString();
        }
      }

      res.json({
        status: bucket.status,
        inGracePeriod: inGrace,
        graceExpiresAt,
        bucketName: bucket.bucketName,
        storageBytes: Number(bucket.storageBytes),
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch suspension status" });
    }
  },
);

export default router;
