import { apiClient } from './client'

export interface ChartDataPoint { date: string; storageBytes: number; storageGb: number; objectCount: number; recordedAt: string }
export interface UsageHistoryResponse { days: number; dataPoints: number; chart: ChartDataPoint[]; summary: { maxBytes: number; minBytes: number; latestBytes: number } }
export interface DailyCostDataPoint { date: string; amountUsd: number; storageBytes: number; periodStart: string; periodEnd: string }
export interface DailyCostResponse { days: number; chart: DailyCostDataPoint[]; totalCost: number; avgDaily: number }
export interface UsageData { current: { storageBytes: number; objectCount: number; lastUpdated: string }; freeTierBytes: number; billableBytes: number; usagePct: number; snapshots: Array<{ storageBytes: number; objectCount: number; recordedAt: string }> }
export interface RotationEvent { id: string; reason: string; rotatedAt: string; ipAddress: string | null }

export const storageApi = {
  getCredentials: async () => { const { data } = await apiClient.get('/storage/credentials'); return data },
  getStatus: async () => { const { data } = await apiClient.get('/storage/status'); return data },
  getUsage: async (): Promise<UsageData> => { const { data } = await apiClient.get('/storage/usage'); return data },
  getUsageHistory: async (days = 30): Promise<UsageHistoryResponse> => { const { data } = await apiClient.get(`/storage/usage/history?days=${days}`); return data },
  getDailyCost: async (days = 30): Promise<DailyCostResponse> => { const { data } = await apiClient.get(`/storage/usage/daily-cost?days=${days}`); return data },
  getBalance: async (): Promise<{ amountUsd: number; updatedAt: string | null }> => { const { data } = await apiClient.get('/storage/balance'); return data },
  getTransactions: async () => { const { data } = await apiClient.get('/storage/transactions'); return data.transactions },
  refreshUsage: async () => { const { data } = await apiClient.post('/storage/refresh-usage'); return data },
  regenerateKeys: async () => { const { data } = await apiClient.post('/storage/regenerate-keys'); return data },
  getRotationHistory: async (): Promise<{ history: RotationEvent[] }> => { const { data } = await apiClient.get('/storage/rotation-history'); return data },
  getSyncStatus: async () => { const { data } = await apiClient.get('/storage/sync-status'); return data },
  getSuspensionStatus: async () => { const { data } = await apiClient.get('/storage/suspension-status'); return data },
}
