import { Decimal } from '@prisma/client/runtime/library'
import { prisma } from './client'

// ─── User queries ──────────────────────────────────────────
export async function createUser(email: string, passwordHash: string) {
  return prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true },
  })
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, walletAddress: true, createdAt: true },
  })
}

// ─── Balance queries ───────────────────────────────────────
export async function getBalance(userId: string): Promise<number> {
  const balance = await prisma.balance.findUnique({
    where: { userId },
    select: { amountUsd: true },
  })
  return balance ? Number(balance.amountUsd) : 0
}

export async function creditBalance(userId: string, amountUsd: number): Promise<void> {
  await prisma.balance.upsert({
    where: { userId },
    create: { userId, amountUsd: new Decimal(amountUsd) },
    update: { amountUsd: { increment: new Decimal(amountUsd) } },
  })
}

export async function deductBalance(userId: string, amountUsd: number): Promise<void> {
  await prisma.$executeRaw`
    UPDATE balances
    SET amount_usd = GREATEST(0, amount_usd - ${amountUsd}::numeric)
    WHERE user_id = ${userId}
  `
}

// ─── Transaction queries ───────────────────────────────────
export async function txExists(signature: string): Promise<boolean> {
  const tx = await prisma.transaction.findUnique({
    where: { txSignature: signature },
    select: { id: true },
  })
  return tx !== null
}

export async function recordTransaction(data: {
  userId: string
  txSignature: string
  solAmount: number
  usdAmount: number
  solPriceUsd: number
}) {
  return prisma.transaction.create({
    data: {
      userId: data.userId,
      txSignature: data.txSignature,
      solAmount: new Decimal(data.solAmount),
      usdAmount: new Decimal(data.usdAmount),
      solPriceUsd: new Decimal(data.solPriceUsd),
    },
  })
}

// ─── Bucket queries ────────────────────────────────────────
export async function getBucket(userId: string) {
  return prisma.bucket.findUnique({ where: { userId } })
}

export async function createBucket(data: {
  userId: string
  bucketName: string
  cfTokenId: string
  cfAccessKey: string
  cfSecretKey: string
}) {
  return prisma.bucket.create({
    data: {
      userId: data.userId,
      bucketName: data.bucketName,
      cfTokenId: data.cfTokenId,
      cfAccessKey: data.cfAccessKey,
      cfSecretKey: data.cfSecretKey,
      provider: 'R2',
    },
  })
}

export async function updateBucketStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED') {
  return prisma.bucket.update({ where: { userId }, data: { status } })
}

export async function updateBucketStorage(userId: string, storageBytes: number) {
  return prisma.bucket.update({
    where: { userId },
    data: { storageBytes: BigInt(storageBytes) },
  })
}
