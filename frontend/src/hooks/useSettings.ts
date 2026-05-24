import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { settingsApi } from "../api/settings.api";
import { useAuthStore } from "../store/auth.store";

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: settingsApi.getProfile });
}

export function useNotificationPrefs() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: settingsApi.getNotifications,
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateWallet,
    onSuccess: () => {
      toast.success("Wallet address linked");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error ?? "Failed to update wallet"),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => settingsApi.changePassword(currentPassword, newPassword),
    onSuccess: () => toast.success("Password updated successfully"),
    onError: (err: any) =>
      toast.error(err?.response?.data?.error ?? "Failed to update password"),
  });
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateNotifications,
    onSuccess: () => {
      toast.success("Preferences saved");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to save preferences"),
  });
}

export function useDeleteAccount() {
  const { clearAuth } = useAuthStore();
  return useMutation({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted");
      clearAuth();
      window.location.href = "/";
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.error ?? "Failed to delete account"),
  });
}
