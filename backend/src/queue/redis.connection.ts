import { Redis } from 'ioredis'
import { config } from '../config'

const REDIS_OPTIONS = { maxRetriesPerRequest: null as any, enableReadyCheck: false, lazyConnect: true }

let _producerConnection: Redis | null = null
let _workerConnection: Redis | null = null

export function getProducerConnection(): Redis {
  if (_producerConnection) return _producerConnection
  _producerConnection = new Redis(config.redis.url, REDIS_OPTIONS)
  _producerConnection.on('connect', () => console.log('✅ Redis producer connected'))
  _producerConnection.on('error', (err) => console.error('[redis-producer]', err.message))
  return _producerConnection
}

export function getWorkerConnection(): Redis {
  if (_workerConnection) return _workerConnection
  _workerConnection = new Redis(config.redis.url, REDIS_OPTIONS)
  _workerConnection.on('connect', () => console.log('✅ Redis worker connected'))
  _workerConnection.on('error', (err) => console.error('[redis-worker]', err.message))
  return _workerConnection
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const redis = getProducerConnection()
    await redis.connect()
    const pong = await redis.ping()
    return pong === 'PONG'
  } catch { return false }
}
