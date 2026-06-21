import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config'
import { testConnection } from './db/client'
import { initIndexerState } from './db/indexer.state'
import { checkSolanaConnection } from './services/solana.connection'
import { getPlatformKeypair, getPlatformAddress } from './services/wallet.service'
import { startIndexer } from './services/indexer.service'
import { startBillingScheduler } from './services/billing/billing.scheduler'
import { startUsageSync } from './services/usage.sync'
import { checkRedisConnection } from './queue/redis.connection'
import { startWorker } from './queue/worker'
import { errorHandler } from './middleware/error.middleware'
import { generalApiRateLimit } from './middleware/rate.limit'
import { healUnprovisionedUsers } from './services/heal.service';
import filebrowserRouter from './routes/filebrowser.route'

import authRouter from './routes/auth.route'
import solanaRouter from './routes/solana.route'
import storageRouter from './routes/storage.route'
import billingRouter from './routes/billing.route'
import settingsRouter from './routes/settings.route'
import waitlistRouter from './routes/waitlist.route'

const app = express()

//  CORS — restrict origins in production 
const allowedOrigins = config.app.nodeEnv === 'production'
  ? [config.app.frontendUrl]
  : [config.app.frontendUrl, 'http://localhost:5173']

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

//  Helmet with CSP 
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        config.app.frontendUrl,
        'https://api.devnet.solana.com',
        'https://api.mainnet-beta.solana.com',
        'https://solana-api.projectserum.com',
        'https://rpc.ankr.com',
        'https://api.coingecko.com',
        'https://api.binance.com',
        'https://solstore.pro',
        'http://localhost:5173',
      ],
    },
  },
}))

app.use(express.json({ limit: '10kb' }))

//  General rate limit on all API routes 
app.use('/api', generalApiRateLimit)

//  Health check ─
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    env: config.app.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

//  Routes ─
app.use('/api/auth', authRouter)
app.use('/api/solana', solanaRouter)
app.use('/api/storage', storageRouter)
app.use('/api/billing', billingRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/files', filebrowserRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})
app.use(errorHandler)

// Startup
async function start() {
  console.log('Starting SolStore backend...\n')

  // Database
  await testConnection()

  // Redis
  const redisOk = await checkRedisConnection()
  if (!redisOk) {
    console.warn('Redis connection failed — queue disabled. Start Redis and restart.')
  } else {
    startWorker()
  }

  // Solana
  const solanaOk = await checkSolanaConnection()
  if (!solanaOk) {
    console.warn('Solana connection failed — indexer disabled')
  } else {
    if (config.solana.platformWalletPrivateKey) {
      try {
        const keypair = getPlatformKeypair()
        console.log(`Platform wallet: ${getPlatformAddress()}`)
        if (keypair.publicKey.toBase58() !== getPlatformAddress()) {
          console.error('WALLET MISMATCH — check your env vars')
          process.exit(1)
        }
        await initIndexerState()
        startIndexer().catch(err => console.error('[indexer] Failed to start:', err.message))

      } catch (err) {
        console.warn('Wallet not configured — indexer disabled')
      }
    } else {
      console.warn('PLATFORM_WALLET_PRIVATE_KEY not set — indexer disabled')
    }
  }

  // Billing scheduler (PAYG + subscriptions)
  startBillingScheduler()

  // Usage sync
  if (config.cloudflare.accountId) {
    startUsageSync()
  } else {
    console.warn('Cloudflare not configured — usage sync disabled')
  }

  // Auto-heal users with balance but no provisioned bucket
  if (redisOk) {
    setTimeout(() => {
      healUnprovisionedUsers().catch(err =>
        console.error('[heal] Startup heal failed:', err.message)
      )
    }, 3000)
  }

  // Start HTTP server
  app.listen(config.app.port, () => {
    console.log(`Backend running on http://localhost:${config.app.port}`)
    console.log(`   Environment: ${config.app.nodeEnv}`)
    console.log(`   Frontend:    ${config.app.frontendUrl}\n`)
  })
}

start().catch((err) => {
  console.error('Fatal startup error:', err)
  process.exit(1)
})