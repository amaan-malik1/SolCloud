import IORedis from 'ioredis'
import { config } from "../config";

const REDIS_OPTIONS = {
  maxRetriesPerRequest: null as any,
  enableReadyCheck: false,
  lazyConnect: true,
  ...(process.env.NODE_ENV === "production" && {
    tls: { rejectUnauthorized: false },
  }),
};

let _producerConnection: IORedis | null = null;
let _workerConnection: IORedis | null = null;

export function getProducerConnection(): IORedis {
  if (_producerConnection) return _producerConnection;
  _producerConnection = new IORedis(config.redis.url, REDIS_OPTIONS);
  _producerConnection.on("connect", () =>
    console.log("✅ Redis producer connected"),
  );
  _producerConnection.on("error", (err) =>
    console.error("[redis-producer]", err.message),
  );
  return _producerConnection;
}

export function getWorkerConnection(): IORedis {
  if (_workerConnection) return _workerConnection;
  _workerConnection = new IORedis(config.redis.url, REDIS_OPTIONS);
  _workerConnection.on("connect", () =>
    console.log("✅ Redis worker connected"),
  );
  _workerConnection.on("error", (err) =>
    console.error("[redis-worker]", err.message),
  );
  return _workerConnection;
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    const redis = getProducerConnection();
    await redis.connect();
    const pong = await redis.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}
