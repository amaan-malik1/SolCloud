import { prisma } from "../db/client";
import { getStorageProvider } from "../storage";
import { encrypt } from "../utils/encryption";
import { getBucket, createBucket, updateBucketStatus } from "../db/queries";

export async function provisionStorage(event: {
  userId: string;
  txSignature: string;
  solAmount: number;
  usdAmount: number;
  solPriceUsd: number;
}): Promise<void> {
  const { userId } = event
  console.log('[provisioner] Starting for user:', userId)

  const existing = await getBucket(userId)
  console.log('[provisioner] Existing bucket:', existing?.bucketName ?? 'none')

  if (existing) {
    if (existing.status === 'SUSPENDED') {
      await reactivateStorage(userId)
    } else {
      console.log('[provisioner] Already has active storage')
    }
    return
  }

  const provider = getStorageProvider()
  console.log('[provisioner] Calling provider.createBucket...')

  let credentials: any
  try {
    credentials = await provider.createBucket(userId)
    console.log('[provisioner] Bucket created:', credentials.bucketName)
  } catch (err) {
    console.error('[provisioner] createBucket FAILED:', err)
    throw err
  }

  try {
    await createBucket({
      userId,
      bucketName: credentials.bucketName,
      cfTokenId: credentials.tokenId ?? '',
      cfAccessKey: encrypt(credentials.accessKey),
      cfSecretKey: encrypt(credentials.secretKey),
    })
    console.log('[provisioner] Saved to DB ✅')
  } catch (err) {
    console.error('[provisioner] DB save FAILED:', err)
    throw err
  }
}

export async function reactivateStorage(userId: string): Promise<void> {
  const bucket = await getBucket(userId);
  if (!bucket) throw new Error(`No bucket found for user ${userId}`);

  const provider = getStorageProvider();
  const newCreds = await provider.reactivateBucket(bucket.bucketName, userId);

  await prisma.bucket.update({
    where: { userId },
    data: {
      cfTokenId: newCreds.tokenId,
      cfAccessKey: encrypt(newCreds.accessKey),
      cfSecretKey: encrypt(newCreds.secretKey),
      status: "ACTIVE",
    },
  });

  // clear grace period
  await prisma.indexerState
    .deleteMany({ where: { key: `grace:${userId}` } })
    .catch(() => { });
  console.log(`Storage reactivated for user ${userId}`);
}

export async function suspendStorage(userId: string): Promise<void> {
  const bucket = await getBucket(userId);
  if (!bucket || bucket.status !== "ACTIVE") return;

  const provider = getStorageProvider();
  try {
    await provider.suspendBucket(
      bucket.bucketName,
      bucket.cfTokenId ?? undefined,
    );
  } catch (err) {
    console.error(`[provisioner] CF token revoke failed for ${userId}:`, err);
  }

  await updateBucketStatus(userId, "SUSPENDED");
  await prisma.bucket.update({ where: { userId }, data: { cfTokenId: null } });
  console.log(` Suspended storage for user ${userId}`);
}
