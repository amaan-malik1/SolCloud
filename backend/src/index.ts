import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { testConnection } from "./db/client";
import { initIndexerState } from "./db/indexer.state";
import { checkSolanaConnection } from "./services/solana.connection";
import {
  getPlatformKeypair,
  getPlatformAddress,
} from "./services/wallet.service";
import { startIndexer } from "./services/indexer.service";
import { startBillingScheduler } from "./services/billing/billing.scheduler";
import { startUsageSync } from "./services/usage.sync";
import { checkRedisConnection } from "./queue/redis.connection";
import { startWorker } from "./queue/worker";
import { errorHandler } from "./middleware/error.middleware";

import authRouter from "./routes/auth.route";
import solanaRouter from "./routes/solana.route";
import storageRouter from "./routes/storage.route";
import billingRouter from "./routes/billing.route";
import settingsRouter from "./routes/settings.route";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [config.app.frontendUrl,"https://solstore.pro", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));

// health check route
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    env: config.app.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/solana", solanaRouter);
app.use("/api/storage", storageRouter);
app.use("/api/billing", billingRouter);
app.use("/api/settings", settingsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use(errorHandler);

// Startup
async function start() {
  console.log("Starting SolStore backend...\n");

  // Database
  await testConnection();

  // Redis
  const redisOk = await checkRedisConnection();
  if (!redisOk) {
    console.warn(
      "Redis connection failed — queue disabled. Start Redis and restart.",
    );
  } else {
    startWorker();
  }

  // Solana
  const solanaOk = await checkSolanaConnection();
  if (!solanaOk) {
    console.warn("Solana connection failed — indexer disabled");
  } else {
    if (config.solana.platformWalletPrivateKey) {
      try {
        const keypair = getPlatformKeypair();
        console.log(`Platform wallet: ${getPlatformAddress()}`);
        if (keypair.publicKey.toBase58() !== getPlatformAddress()) {
          console.error("WALLET MISMATCH — check your env vars");
          process.exit(1);
        }
        await initIndexerState();
        await startIndexer();
      } catch (err) {
        console.warn("Wallet not configured — indexer disabled");
      }
    } else {
      console.warn("PLATFORM_WALLET_PRIVATE_KEY not set — indexer disabled");
    }
  }

  // Billing scheduler
  startBillingScheduler();

  // Usage sync
  if (config.cloudflare.accountId) {
    startUsageSync();
  } else {
    console.warn("Cloudflare not configured — usage sync disabled");
  }

  // Start HTTP server
  app.listen(config.app.port, () => {
    console.log(` Backend running on http://localhost:${config.app.port}`);
    console.log(`   Environment: ${config.app.nodeEnv}`);
    console.log(`   Frontend:    ${config.app.frontendUrl}\n`);
  });
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
