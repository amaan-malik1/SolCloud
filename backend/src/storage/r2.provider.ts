import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import axios from "axios";
import { config } from "../config";
import type {
  StorageProvider,
  BucketCredentials,
  UsageStats,
} from "./provider.interface";

const CF_API_BASE = "https://api.cloudflare.com/client/v4";

export class CloudflareR2Provider implements StorageProvider {
  private getS3Client(): S3Client {
    return new S3Client({
      region: "auto",
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.cloudflare.r2AccessKey!,
        secretAccessKey: config.cloudflare.r2SecretKey!,
      },
    });
  }

  private cfApi() {
    return axios.create({
      baseURL: CF_API_BASE,
      headers: {
        Authorization: `Bearer ${config.cloudflare.apiToken}`,
        "Content-Type": "application/json",
      },
      timeout: 15_000,
    });
  }

  private generateBucketName(userId: string): string {
    const shortId = userId.replace(/-/g, "").slice(0, 8);
    const ts = Date.now().toString(36);
    return `ss-${shortId}-${ts}`.toLowerCase();
  }

  async createBucket(userId: string): Promise<BucketCredentials> {
    const bucketName = this.generateBucketName(userId);
    const s3 = this.getS3Client();
    const api = this.cfApi();

    try {
      await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`[r2] Bucket created: ${bucketName}`);
    } catch (err: any) {
      if (err.name === "BucketAlreadyExists")
        throw new Error(`Bucket collision: ${bucketName}`);
      throw err;
    }

    const tokenRes = await api.post(
      `/accounts/${config.cloudflare.accountId}/r2/tokens`,
      {
        name: `solstore-user-${userId.slice(0, 8)}`,
        policies: [
          {
            effect: "allow",
            resources: {
              [`com.cloudflare.api.account.r2.bucket.${config.cloudflare.accountId}.${bucketName}`]:
                "*",
            },
            actions: ["admin"],
          },
        ],
      },
    );

    if (!tokenRes.data?.success) {
      await this.deleteBucket(bucketName).catch(() => {});
      throw new Error("Failed to create R2 API token");
    }

    const tokenData = tokenRes.data.result;
    console.log(`[r2] Scoped token created for: ${bucketName}`);

    return {
      bucketName,
      provider: "R2",
      accessKey: tokenData.accessKeyId,
      secretKey: tokenData.secretAccessKey,
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      tokenId: tokenData.id,
    };
  }

  async deleteBucket(bucketName: string): Promise<void> {
    const s3 = this.getS3Client();
    await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
  }

  async suspendBucket(_bucketName: string, tokenId?: string): Promise<void> {
    if (!tokenId) return;
    const api = this.cfApi();
    await api.delete(
      `/accounts/${config.cloudflare.accountId}/r2/tokens/${tokenId}`,
    );
    console.log(`[r2] Token revoked: ${tokenId}`);
  }

  async reactivateBucket(
    bucketName: string,
    userId: string,
  ): Promise<BucketCredentials> {
    const api = this.cfApi();
    const tokenRes = await api.post(
      `/accounts/${config.cloudflare.accountId}/r2/tokens`,
      {
        name: `solstore-user-${userId.slice(0, 8)}-reactivated`,
        policies: [
          {
            effect: "allow",
            resources: {
              [`com.cloudflare.api.account.r2.bucket.${config.cloudflare.accountId}.${bucketName}`]:
                "*",
            },
            actions: ["admin"],
          },
        ],
      },
    );

    if (!tokenRes.data?.success)
      throw new Error("Failed to create new R2 token on reactivation");

    const tokenData = tokenRes.data.result;
    console.log(`[r2] Bucket reactivated: ${bucketName}`);

    return {
      bucketName,
      provider: "R2",
      accessKey: tokenData.accessKeyId,
      secretKey: tokenData.secretAccessKey,
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      tokenId: tokenData.id,
    };
  }

  async getUsageBytes(bucketName: string): Promise<UsageStats> {
    const s3 = this.getS3Client();
    let totalBytes = 0,
      objectCount = 0;
    let continuationToken: string | undefined;

    do {
      const res = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        }),
      );
      for (const obj of res.Contents ?? []) {
        totalBytes += obj.Size ?? 0;
        objectCount++;
      }
      continuationToken = res.NextContinuationToken;
    } while (continuationToken);

    return { storageBytes: totalBytes, objectCount };
  }
}
