import { prisma } from '../db/client'
import { decrypt } from '../utils/encryption'
import { getBucket } from '../db/queries'

export type RotationReason = 'manual' | 'compromised' | 'scheduled'

export async function logCredentialRotation(userId: string, reason: RotationReason, ipAddress?: string): Promise<void> {
  await prisma.credentialRotation.create({ data: { userId, reason, ipAddress } })
}

export async function getRotationHistory(userId: string, limit = 10) {
  return prisma.credentialRotation.findMany({
    where: { userId },
    orderBy: { rotatedAt: 'desc' },
    take: limit,
    select: { id: true, reason: true, rotatedAt: true, ipAddress: true },
  })
}

export async function getDecryptedCredentials(userId: string) {
  const bucket = await getBucket(userId)
  if (!bucket) return { error: 'NO_BUCKET' as const }
  if (bucket.status === 'SUSPENDED') return { error: 'SUSPENDED' as const }
  if (bucket.status === 'DELETED') return { error: 'DELETED' as const }
  if (!bucket.cfAccessKey || !bucket.cfSecretKey) return { error: 'NO_CREDENTIALS' as const }

  try {
    const accessKeyId = decrypt(bucket.cfAccessKey)
    const secretAccessKey = decrypt(bucket.cfSecretKey)
    return {
      bucket: {
        name: bucket.bucketName,
        provider: bucket.provider,
        status: bucket.status,
        storageBytes: Number(bucket.storageBytes),
        createdAt: bucket.createdAt,
        updatedAt: bucket.updatedAt,
      },
      credentials: {
        accessKeyId,
        secretAccessKey,
        endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
      },
    }
  } catch {
    return { error: 'DECRYPT_FAILED' as const }
  }
}
