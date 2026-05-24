import { prisma } from "../../db/client";
import { Decimal } from "@prisma/client/runtime/library";

export async function recordBillingCharge(data: {
  userId: string;
  amountUsd: number;
  storageBytes: number;
  gbHours: number;
  periodStart: Date;
  periodEnd: Date;
}) {
  return prisma.billingRecord.create({
    data: {
      userId: data.userId,
      amountUsd: new Decimal(data.amountUsd),
      storageBytes: BigInt(data.storageBytes),
      gbHours: new Decimal(data.gbHours),
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
    },
  });
}

export async function recordUsageSnapshot(data: {
  userId: string;
  storageBytes: number;
  objectCount: number;
}) {
  return prisma.usageSnapshot.create({
    data: {
      userId: data.userId,
      storageBytes: BigInt(data.storageBytes),
      objectCount: data.objectCount,
    },
  });
}

export async function getActiveBucketsWithUsers() {
  return prisma.bucket.findMany({
    where: { status: "ACTIVE" },
    include: { user: { include: { balance: true } } },
  });
}

export async function getUserBillingHistory(userId: string, limit = 30) {
  return prisma.billingRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      amountUsd: true,
      storageBytes: true,
      gbHours: true,
      periodStart: true,
      periodEnd: true,
      createdAt: true,
    },
  });
}

export async function getTotalBilled(userId: string): Promise<number> {
  const result = await prisma.billingRecord.aggregate({
    where: { userId },
    _sum: { amountUsd: true },
  });
  return Number(result._sum.amountUsd ?? 0);
}

export async function getLatestSnapshot(userId: string) {
  return prisma.usageSnapshot.findFirst({
    where: { userId },
    orderBy: { recordedAt: "desc" },
  });
}
