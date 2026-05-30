import { apiClient } from "./client";
import type { AuthResponse, User } from "../types";

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", {
      email,
      password,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>("/auth/me");
    return data.user;
  },

  verifyEmail: async (token: string) => {
    const { data } = await apiClient.get(`/auth/verify-email?token=${token}`)
    return data
  },

  resendVerification: async (email: string) => {
    const { data } = await apiClient.post('/auth/resend-verification', { email })
    return data
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post('/auth/reset-password', { token, password })
    return data
  },
};
