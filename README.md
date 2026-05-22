# SolStore — Permissionless Cloud Storage on Solana

Pay with SOL. Get instant Cloudflare R2 object storage. No credit card required.

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- A Cloudflare account (for R2 storage)

### 1. Clone and install

```bash
# Backend
cd backend
npm install
cp .env.example .env    # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.local.example .env.local   # or edit .env.local directly
```

### 2. Generate secrets

```bash
# JWT Secret (64 chars)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Encryption Key (32 bytes = 64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste output into `backend/.env` for `JWT_SECRET` and `ENCRYPTION_KEY`.

### 3. Generate platform wallet

```bash
cd backend
npx ts-node -e "
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const kp = Keypair.generate();
console.log('PLATFORM_WALLET_ADDRESS=' + kp.publicKey.toBase58());
console.log('PLATFORM_WALLET_PRIVATE_KEY=' + bs58.default.encode(kp.secretKey));
"
```

Paste both into `backend/.env`.

### 4. Set up database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start services

```bash
# Terminal 1 — Redis
redis-server
# OR with Docker:
docker run --name solstore-redis -p 6379:6379 -d redis:alpine

# Terminal 2 — Backend
cd backend
npm run dev

# Terminal 3 — Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

### Backend `.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | 64-char hex string for JWT signing |
| `ENCRYPTION_KEY` | ✅ | 64-char hex string for AES-256-GCM |
| `PLATFORM_WALLET_ADDRESS` | ✅ | Solana public key (receives payments) |
| `PLATFORM_WALLET_PRIVATE_KEY` | ✅ | Solana private key (base58) |
| `CF_ACCOUNT_ID` | ⚠️ | Cloudflare account ID (R2) |
| `CF_API_TOKEN` | ⚠️ | Cloudflare API token |
| `CF_R2_ACCESS_KEY` | ⚠️ | R2 access key |
| `CF_R2_SECRET_KEY` | ⚠️ | R2 secret key |
| `REDIS_URL` | ✅ | Redis connection URL |
| `SOLANA_NETWORK` | ✅ | `devnet` or `mainnet-beta` |

⚠️ = Required for full functionality, optional for auth/UI testing

### Frontend `.env.local`

```
VITE_API_URL=http://localhost:3001
VITE_SOLANA_NETWORK=devnet
```

---

## Without Cloudflare R2

The app starts and auth/dashboard work without R2 credentials. Storage features (bucket creation, credentials page) will show "not provisioned" state. Add CF credentials when ready to enable full storage functionality.

---

## Project Structure

```
solstore/
  backend/
    src/
      config/          Typed env config (Zod)
      db/              Prisma client + queries
      middleware/       Auth, rate limiting, errors
      queue/           BullMQ + Redis worker
      routes/          Express API routes
      services/        Business logic
        billing/       Billing engine + scheduler
      storage/         Provider abstraction (R2 → AWS → GCS)
      utils/           Encryption (AES-256-GCM)
    prisma/
      schema.prisma
  frontend/
    src/
      api/             Axios API clients
      components/      Reusable UI components
        layout/        Navbar, Sidebar, DashboardLayout
        shared/        Cards, charts, forms
      context/         Solana wallet provider
      hooks/           React Query hooks
      pages/           Route page components
      store/           Zustand auth store
      lib/             Utils, payment builder, snippets
```

---

## Architecture

```
User pays SOL (Phantom wallet)
    ↓
Solana indexer detects tx (2s poll)
    ↓
Balance credited to user account
    ↓
BullMQ job queued → worker picks up
    ↓ (retries 5x with exponential backoff)
Cloudflare R2 bucket created
Scoped API token issued
    ↓
Credentials encrypted (AES-256-GCM) → stored in DB
    ↓
User sees credentials on dashboard
    ↓
Midnight UTC: billing engine runs
Usage measured → balance deducted
Zero balance → 24h grace → suspend
New payment → auto-reactivate
```

---

## Running Tests

```bash
cd backend

# Unit tests (no external services needed)
npm run test:unit

# Integration tests (needs DB)
npm run test:integration

# Full E2E (needs devnet + all services)
RUN_E2E=true npm run test:e2e
```

---

## Tech Stack

**Backend:** Node.js · TypeScript · Express · Prisma · PostgreSQL · BullMQ · Redis · @solana/web3.js · @aws-sdk/client-s3

**Frontend:** React 18 · TypeScript · Vite · Tailwind CSS · React Query · Zustand · Solana Wallet Adapter · Recharts

**Infrastructure:** Cloudflare R2 · Solana (devnet/mainnet)
