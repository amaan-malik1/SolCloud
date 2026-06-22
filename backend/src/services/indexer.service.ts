import { Connection, PublicKey, type ParsedTransactionWithMeta } from '@solana/web3.js'
import { config } from '../config'
import { getPlatformAddress } from './wallet.service'
import { getLastSignature, setLastSignature } from '../db/indexer.state'
import { txExists, recordTransaction, creditBalance, findUserById } from '../db/queries'
import { queueProvisionStorage } from '../queue/queues'
import { getSolPriceUsd } from './price.service'

// ── Constants ────────────────────────────────────────────────────────────
const MIN_SOL_AMOUNT = 0.001
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const STARTUP_RECOVERY_LIMIT = 30

const POLLING_ENABLED = process.env.INDEXER_POLLING_ENABLED === 'true'
const POLL_INTERVAL_MS = config.solana.pollIntervalMs ?? 8000

// ── RPC ──────────────────────────────────────────────────────────────────
const RPC_ENDPOINTS = config.solana.network === 'mainnet-beta'
  ? [
    process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com',
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
  ]
  : [
    process.env.HELIUS_RPC_URL || 'https://api.devnet.solana.com',
    'https://api.devnet.solana.com',
  ]

let _connection: Connection | null = null
let _currentRpcIndex = 0

// ── Internal status tracking ───────────────────────────────────────────────
let _started = false
let _pollTimer: ReturnType<typeof setInterval> | null = null
let _consecutiveErrors = 0
let _totalProcessed = 0
let _lastProcessedAt: Date | null = null
let _lastError: string | null = null
let _startedAt: Date | null = null
let _mode: 'webhook' | 'polling' = POLLING_ENABLED ? 'polling' : 'webhook'

function getConnection(): Connection {
  if (_connection) return _connection
  _connection = new Connection(RPC_ENDPOINTS[_currentRpcIndex], 'confirmed')
  return _connection
}

function rotateRpc(): Connection {
  _currentRpcIndex = (_currentRpcIndex + 1) % RPC_ENDPOINTS.length
  console.warn(`[indexer] Rotating to RPC: ${RPC_ENDPOINTS[_currentRpcIndex]}`)
  _connection = new Connection(RPC_ENDPOINTS[_currentRpcIndex], 'confirmed')
  return _connection
}

function extractUserId(memo: string): string | null {
  if (UUID_REGEX.test(memo)) return memo
  const legacyMatch = memo.match(/^solstore:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}):v\d+$/i)
  if (legacyMatch) return legacyMatch[1]
  return null
}

function extractMemo(tx: ParsedTransactionWithMeta): string | null {
  const memoInstruction = tx.transaction.message.instructions.find(
    (ix: any) => ix.programId?.toBase58?.() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
  )
  if (!memoInstruction) return null
  return (memoInstruction as any).parsed ?? null
}

function extractSolAmount(tx: ParsedTransactionWithMeta, platformAddress: string): number {
  const accountKeys = tx.transaction.message.accountKeys
  const platformIndex = accountKeys.findIndex(
    (key: any) => key.pubkey.toBase58() === platformAddress
  )
  if (platformIndex === -1) return 0
  const preBalance = tx.meta?.preBalances?.[platformIndex] ?? 0
  const postBalance = tx.meta?.postBalances?.[platformIndex] ?? 0
  return (postBalance - preBalance) / 1e9
}


export async function processTransaction(signature: string): Promise<void> {
  if (await txExists(signature)) {
    console.log(`[indexer] Duplicate tx skipped: ${signature.slice(0, 20)}`)
    return
  }

  const connection = getConnection()
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  })

  if (!tx || tx.meta?.err) {
    console.log(`[indexer] Skipping failed/missing tx: ${signature.slice(0, 20)}`)
    return
  }

  const platformAddress = getPlatformAddress()
  const solAmount = extractSolAmount(tx, platformAddress)

  if (solAmount <= 0) return

  if (solAmount < MIN_SOL_AMOUNT) {
    console.log(`[indexer] Ignoring dust tx (${solAmount} SOL): ${signature.slice(0, 20)}`)
    await recordTransaction({
      userId: 'DUST',
      txSignature: signature,
      solAmount,
      usdAmount: 0,
      solPriceUsd: 0,
    }).catch(() => { })
    return
  }

  const memo = extractMemo(tx)
  if (!memo) {
    console.warn(`[indexer] No memo found, cannot credit: ${signature.slice(0, 20)}`)
    return
  }

  const userId = extractUserId(memo)
  if (!userId) {
    console.warn(`[indexer] Unrecognized memo format, skipping: "${memo}"`)
    return
  }

  const user = await findUserById(userId)
  if (!user) {
    console.warn(`[indexer] No user found for userId: ${userId} — possible spoofed memo`)
    return
  }

  const solPriceUsd = await getSolPriceUsd()
  const usdAmount = solAmount * solPriceUsd

  await recordTransaction({ userId, txSignature: signature, solAmount, usdAmount, solPriceUsd })
  await creditBalance(userId, usdAmount)

  _totalProcessed++
  _lastProcessedAt = new Date()

  console.log(`✅ Payment processed: ${solAmount} SOL ($${usdAmount.toFixed(3)}) → user ${userId.slice(0, 8)}`)

  await queueProvisionStorage({ userId, txSignature: signature, solAmount, usdAmount, solPriceUsd })
  console.log(`[queue] Queued provision for user ${userId.slice(0, 8)}`)
}


export async function recoverMissedTransactions(): Promise<void> {
  console.log(`[indexer] Running startup recovery (last ${STARTUP_RECOVERY_LIMIT} txs)...`)
  const connection = getConnection()
  const platformPubkey = new PublicKey(getPlatformAddress())

  try {
    const signatures = await connection.getSignaturesForAddress(platformPubkey, {
      limit: STARTUP_RECOVERY_LIMIT,
    })

    let recovered = 0
    for (const sigInfo of signatures) {
      const existed = await txExists(sigInfo.signature)
      if (!existed) {
        await processTransaction(sigInfo.signature)
        recovered++
        await new Promise(resolve => setTimeout(resolve, 250))
      }
    }

    if (recovered > 0) {
      console.log(`[indexer] ✅ Recovery complete — processed ${recovered} missed tx(s)`)
    } else {
      console.log(`[indexer] Recovery complete — no missed transactions`)
    }
  } catch (err: any) {
    console.error(`[indexer] Recovery scan failed:`, err.message)
  }
}

async function poll(): Promise<void> {
  try {
    const connection = getConnection()
    const platformPubkey = new PublicKey(getPlatformAddress())
    const lastSignature = await getLastSignature()

    const signatures = await connection.getSignaturesForAddress(platformPubkey, {
      until: lastSignature ?? undefined,
      limit: 50,
    })

    if (signatures.length === 0) {
      _consecutiveErrors = 0
      return
    }

    const ordered = [...signatures].reverse()
    for (const sigInfo of ordered) {
      await processTransaction(sigInfo.signature)
    }

    await setLastSignature(signatures[0].signature)
    _consecutiveErrors = 0
    _lastError = null
  } catch (err: any) {
    _consecutiveErrors++
    _lastError = err.message
    console.error(`[indexer] Poll error:`, err.message)

    if (_consecutiveErrors >= 3 && RPC_ENDPOINTS.length > 1) {
      rotateRpc()
      _consecutiveErrors = 0
    }
  }
}


export async function startIndexer(): Promise<void> {
  _started = true
  _startedAt = new Date()

  // Always run recovery once on boot — catches anything missed while offline
  await recoverMissedTransactions()

  if (POLLING_ENABLED) {
    console.log(`🔍 Indexer in POLLING mode — every ${POLL_INTERVAL_MS}ms`)
    _mode = 'polling'
    _pollTimer = setInterval(poll, POLL_INTERVAL_MS)
  } else {
    console.log(`🔍 Indexer in WEBHOOK mode — waiting for Helius push events`)
    _mode = 'webhook'
    // No interval timer — transactions arrive via POST /api/solana/webhook
  }
}

export function stopIndexer(): void {
  if (_pollTimer) {
    clearInterval(_pollTimer)
    _pollTimer = null
  }
  _started = false
}

export function getIndexerStatus() {
  return {
    started: _started,
    startedAt: _startedAt,
    mode: _mode,
    network: config.solana.network,
    currentRpc: RPC_ENDPOINTS[_currentRpcIndex],
    pollIntervalMs: POLLING_ENABLED ? POLL_INTERVAL_MS : null,
    consecutiveErrors: _consecutiveErrors,
    lastError: _lastError,
    totalProcessed: _totalProcessed,
    lastProcessedAt: _lastProcessedAt,
    platformAddress: getPlatformAddress(),
  }
}