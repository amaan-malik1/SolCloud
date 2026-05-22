import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SOLANA_NETWORK: z.enum(['mainnet-beta', 'devnet', 'testnet']).default('devnet'),
  PLATFORM_WALLET_ADDRESS: z.string().optional(),
  PLATFORM_WALLET_PRIVATE_KEY: z.string().optional(),
  INDEXER_POLL_INTERVAL_MS: z.string().default('2000'),
  CF_ACCOUNT_ID: z.string().optional(),
  CF_API_TOKEN: z.string().optional(),
  CF_R2_ACCESS_KEY: z.string().optional(),
  CF_R2_SECRET_KEY: z.string().optional(),
  ENCRYPTION_KEY: z.string().min(64, 'ENCRYPTION_KEY must be 64 hex chars').default('0'.repeat(64)),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  STORAGE_PROVIDER: z.enum(['r2', 'aws', 'gcs']).default('r2'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@solstore.dev'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  parsed.error.issues.forEach(issue => {
    console.error(`   ${issue.path.join('.')}: ${issue.message}`)
  })
  process.exit(1)
}

const env = parsed.data

export const config = {
  app: {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    frontendUrl: env.FRONTEND_URL,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
  },
  db: { url: env.DATABASE_URL },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  },
  solana: {
    network: env.SOLANA_NETWORK,
    platformWalletAddress: env.PLATFORM_WALLET_ADDRESS,
    platformWalletPrivateKey: env.PLATFORM_WALLET_PRIVATE_KEY,
    pollIntervalMs: parseInt(env.INDEXER_POLL_INTERVAL_MS, 10),
  },
  cloudflare: {
    accountId: env.CF_ACCOUNT_ID,
    apiToken: env.CF_API_TOKEN,
    r2AccessKey: env.CF_R2_ACCESS_KEY,
    r2SecretKey: env.CF_R2_SECRET_KEY,
  },
  encryption: { key: env.ENCRYPTION_KEY },
  redis: { url: env.REDIS_URL },
  storage: { provider: env.STORAGE_PROVIDER },
  email: {
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
  },
} as const
