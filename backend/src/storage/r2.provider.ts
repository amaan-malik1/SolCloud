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
    const bucketName = this.generateBucketName(userId)
    const s3 = this.getS3Client()

    try {
      await s3.send(new CreateBucketCommand({ Bucket: bucketName }))
      console.log(`[r2] Bucket created: ${bucketName}`)
    } catch (err: any) {
      if (err.name !== 'BucketAlreadyExists') throw err
    }

    // Use master R2 credentials — bucket isolation is enforced at app layer
    return {
      bucketName,
      provider: 'R2',
      accessKey: config.cloudflare.r2AccessKey!,
      secretKey: config.cloudflare.r2SecretKey!,
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      tokenId: 'account',
    }
  }

  async suspendBucket(_bucketName: string, _tokenId?: string): Promise<void> {
    // Bucket isolation — no token to revoke with account-level token
    // Access is blocked at app layer when status = SUSPENDED
    console.log(`[r2] Bucket suspended (app-layer isolation)`)
  }

  async reactivateBucket(bucketName: string, _userId: string): Promise<BucketCredentials> {
    return {
      bucketName,
      provider: 'R2',
      accessKey: config.cloudflare.r2AccessKey!,
      secretKey: config.cloudflare.r2SecretKey!,
      endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      tokenId: 'account',
    }
  }

  async deleteBucket(bucketName: string): Promise<void> {
    const s3 = this.getS3Client();
    await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
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
