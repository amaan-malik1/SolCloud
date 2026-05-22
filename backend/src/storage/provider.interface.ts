export interface BucketCredentials {
  bucketName: string
  provider: 'R2' | 'AWS' | 'GCS'
  accessKey: string
  secretKey: string
  endpoint: string
  region: string
  tokenId?: string
}

export interface UsageStats {
  storageBytes: number
  objectCount: number
}

export interface StorageProvider {
  createBucket(userId: string): Promise<BucketCredentials>
  deleteBucket(bucketName: string): Promise<void>
  suspendBucket(bucketName: string, tokenId?: string): Promise<void>
  reactivateBucket(bucketName: string, userId: string): Promise<BucketCredentials>
  getUsageBytes(bucketName: string): Promise<UsageStats>
}
