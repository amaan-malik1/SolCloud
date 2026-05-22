export interface User { id: string; email: string; walletAddress?: string; createdAt: string }
export interface AuthResponse { token: string; user: User }
export interface Balance { amountUsd: number; updatedAt: string | null }
export interface Bucket { name: string; provider: 'R2' | 'AWS' | 'GCS'; status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'; storageBytes: number; createdAt: string }
export interface StorageCredentials { endpoint: string; region: string; accessKeyId: string; secretAccessKey: string }
export interface StorageResponse { bucket: Bucket; credentials: StorageCredentials }
export interface SolanaStatus { connected: boolean; network: string; platformAddress: string }
export interface Transaction { id: string; txSignature: string; solAmount: number; usdAmount: number; solPriceUsd: number; status: string; createdAt: string }
