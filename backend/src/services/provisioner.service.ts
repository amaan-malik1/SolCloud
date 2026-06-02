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
  const { userId } = event;
  const existing = await getBucket(userId);

  if (existing) {
    if (existing.status === "SUSPENDED") {
      console.log(`[provisioner] Reactivating bucket for user ${userId}`);
      await reactivateStorage(userId);
    } else {
      console.log(`[provisioner] User ${userId} already has active storage`);
    }
    return;
  }

  console.log(`[provisioner] Creating bucket for user ${userId}`);
  const provider = getStorageProvider();
  let credentials;
  try {
    credentials = await provider.createBucket(userId);
  } catch (err) {
    console.error(`[provisioner] Failed to create bucket for ${userId}:`, err);
    throw err;
  }

  await createBucket({
    userId,
    bucketName: credentials.bucketName,
    cfTokenId: credentials.tokenId ?? "",
    cfAccessKey: encrypt(credentials.accessKey),
    cfSecretKey: encrypt(credentials.secretKey),
  });

  console.log(
    `Storage provisioned for user ${userId} → ${credentials.bucketName}`,
  );
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
