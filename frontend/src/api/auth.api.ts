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
};
