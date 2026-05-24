import { apiClient } from "./client";

export interface UserProfile {
  id: string;
  email: string;
  walletAddress: string | null;
  createdAt: string;
  balanceUsd: number;
  totalTransactions: number;
}
export interface NotificationPrefs {
  lowBalanceThreshold: number;
  emailAlerts: boolean;
}

export const settingsApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get("/settings/profile");
    return data;
  },
  updateWallet: async (walletAddress: string): Promise<void> => {
    await apiClient.patch("/settings/wallet", { walletAddress });
  },
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.patch("/settings/password", {
      currentPassword,
      newPassword,
    });
  },
  getNotifications: async (): Promise<NotificationPrefs> => {
    const { data } = await apiClient.get("/settings/notifications");
    return data;
  },
  updateNotifications: async (prefs: NotificationPrefs): Promise<void> => {
    await apiClient.patch("/settings/notifications", prefs);
  },
  deleteAccount: async (password: string): Promise<void> => {
    await apiClient.delete("/settings/account", { data: { password } });
  },
};
