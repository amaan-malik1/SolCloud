import { apiClient } from './client'
import type { SolanaStatus } from '../types'

export const solanaApi = {
  getStatus: async (): Promise<SolanaStatus> => { const { data } = await apiClient.get('/solana/status'); return data },
  getBalance: async () => { const { data } = await apiClient.get('/solana/balance'); return data },
}
