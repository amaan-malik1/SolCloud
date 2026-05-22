import type { StorageProvider } from './provider.interface'
import { CloudflareR2Provider } from './r2.provider'
import { config } from '../config'

let _provider: StorageProvider | null = null

export function getStorageProvider(): StorageProvider {
  if (_provider) return _provider
  switch (config.storage.provider) {
    case 'r2': _provider = new CloudflareR2Provider(); break
    default: throw new Error(`Unknown storage provider: ${config.storage.provider}`)
  }
  return _provider
}

export type { StorageProvider, BucketCredentials, UsageStats } from './provider.interface'
