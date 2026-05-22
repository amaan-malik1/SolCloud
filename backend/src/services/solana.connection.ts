import { Connection, clusterApiUrl, type Cluster } from '@solana/web3.js'
import { config } from '../config'

let _connection: Connection | null = null

export function getConnection(): Connection {
  if (_connection) return _connection
  const endpoint = clusterApiUrl(config.solana.network as Cluster)
  _connection = new Connection(endpoint, { commitment: 'confirmed' })
  console.log(`🔗 Solana connected to ${config.solana.network}`)
  return _connection
}

export async function checkSolanaConnection(): Promise<boolean> {
  try {
    const slot = await getConnection().getSlot()
    console.log(`✅ Solana slot: ${slot}`)
    return true
  } catch (err) {
    console.error('❌ Solana connection failed:', err)
    return false
  }
}
