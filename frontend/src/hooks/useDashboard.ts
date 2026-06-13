import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { storageApi } from "../api/storage.api";
import { solanaApi } from "../api/solana.api";
import { formatBytes } from "../lib/utils";

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: storageApi.getBalance,
    refetchInterval: 15_000,
  });
}

export function useStorageStatus() {
  return useQuery({
    queryKey: ["storage-status"],
    queryFn: storageApi.getStatus,
    refetchInterval: 30_000,
  });
}

export function useUsageData() {
  return useQuery({
    queryKey: ["usage-data"],
    queryFn: storageApi.getUsage,
    refetchInterval: 60_000,
    retry: false,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: storageApi.getTransactions,
    refetchInterval: 10_000
  });
}

export function useSolanaStatus() {
  return useQuery({
    queryKey: ["solana-status"],
    queryFn: solanaApi.getStatus,
    refetchInterval: 60_000,
  });
}

export function useUsageHistory(days = 30) {
  return useQuery({
    queryKey: ["usage-history", days],
    queryFn: () => storageApi.getUsageHistory(days),
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useDailyCost(days = 30) {
  return useQuery({
    queryKey: ["daily-cost", days],
    queryFn: () => storageApi.getDailyCost(days),
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useRotationHistory() {
  return useQuery({
    queryKey: ["rotation-history"],
    queryFn: storageApi.getRotationHistory,
  });
}

export interface SuspensionStatus {
  status: string;
  inGracePeriod: boolean;
  graceExpiresAt: string | null;
  bucketName: string | null;
  storageBytes: number;
}

export function useSuspensionStatus() {
  return useQuery({
    queryKey: ["suspension-status"],
    queryFn: storageApi.getSuspensionStatus,
    refetchInterval: (query) => {
      const data = query.state.data as SuspensionStatus | undefined;
      if (data?.status === "SUSPENDED" || data?.inGracePeriod) return 5_000;
      return 30_000;
    },
  });
}

export function useRefreshUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storageApi.refreshUsage,
    onSuccess: (data) => {
      toast.success(`Usage updated — ${formatBytes(data.storageBytes)} used`);
      queryClient.invalidateQueries({ queryKey: ["usage-data"] });
      queryClient.invalidateQueries({ queryKey: ["storage-status"] });
    },
    onError: () => toast.error("Failed to refresh usage"),
  });
}
