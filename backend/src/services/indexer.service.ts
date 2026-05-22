import { PublicKey, LAMPORTS_PER_SOL, type ConfirmedSignatureInfo } from '@solana/web3.js'
import { config } from '../config'
import { getConnection } from './solana.connection'
import { solToUsd } from './price.service'
import { extractMemo, parseUserIdFromMemo } from './memo.service'
import { txExists, recordTransaction, creditBalance } from '../db/queries'
import { getLastSignature, setLastSignature } from '../db/indexer.state'
import { findUserById } from '../db/queries'
import { queueProvisionStorage } from '../queue/queues'

let isRunning = false
let intervalHandle: NodeJS.Timeout | null = null

async function processTransaction(signature: string): Promise<void> {
  const connection = getConnection()
  if (await txExists(signature)) return

  let tx
  try {
    tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    })
  } catch (err) {
    console.error(`[indexer] Failed to fetch tx ${signature}:`, err)
    return
  }

  if (!tx || tx.meta?.err) return

  const memo = extractMemo(tx)
  if (!memo) return

  const userId = parseUserIdFromMemo(memo)
  if (!userId) {
    console.warn(`[indexer] Could not parse userId from memo: "${memo}"`)
    return
  }

  const user = await findUserById(userId)
  if (!user) {
    console.warn(`[indexer] No user found for userId: ${userId}`)
    return
  }

  const platformAddress = config.solana.platformWalletAddress!
  const accounts = tx.transaction.message.accountKeys
  const platformIndex = accounts.findIndex(a => a.pubkey.toBase58() === platformAddress)
  if (platformIndex === -1) return

  const preLamports = tx.meta!.preBalances[platformIndex]
  const postLamports = tx.meta!.postBalances[platformIndex]
  const lamportsReceived = postLamports - preLamports
  if (lamportsReceived <= 0) return

  const solAmount = lamportsReceived / LAMPORTS_PER_SOL
  if (solAmount < 0.01) return

  let usdAmount: number
  let solPriceUsd: number
  try {
    const converted = await solToUsd(solAmount)
    usdAmount = converted.usdAmount
    solPriceUsd = converted.solPriceUsd
  } catch (err) {
    console.error('[indexer] Price conversion failed:', err)
    return
  }

  try {
    await recordTransaction({ userId, txSignature: signature, solAmount, usdAmount, solPriceUsd })
  } catch (err: any) {
    if (err?.code === '23505') return
    throw err
  }

  await creditBalance(userId, usdAmount)
  console.log(`✅ Payment processed: ${solAmount} SOL ($${usdAmount}) → user ${userId}`)

  await queueProvisionStorage({ userId, txSignature: signature, solAmount, usdAmount, solPriceUsd })
}

async function poll(): Promise<void> {
  const connection = getConnection()
  const platformPubkey = new PublicKey(config.solana.platformWalletAddress!)

  try {
    const lastSig = await getLastSignature()
    const signatures: ConfirmedSignatureInfo[] = await connection.getSignaturesForAddress(
      platformPubkey,
      { limit: 20, until: lastSig ?? undefined }
    )

    if (signatures.length === 0) return

    const ordered = [...signatures].reverse()
    for (const sigInfo of ordered) {
      if (sigInfo.err) continue
      await processTransaction(sigInfo.signature)
      await setLastSignature(sigInfo.signature)
    }
  } catch (err) {
    console.error('[indexer] Poll error:', err)
  }
}

export async function startIndexer(): Promise<void> {
  if (isRunning) return
  console.log(`🔍 Indexer starting — polling every ${config.solana.pollIntervalMs}ms`)
  isRunning = true
  await poll()
  intervalHandle = setInterval(async () => { await poll() }, config.solana.pollIntervalMs)
}

export function stopIndexer(): void {
  if (intervalHandle) { clearInterval(intervalHandle); intervalHandle = null }
  isRunning = false
}

export function getIndexerStatus() { return { running: isRunning } }
