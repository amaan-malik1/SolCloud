import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setEmailVerified: (verified: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("solstore_token", token);
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem("solstore_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
      setEmailVerified: (verified: boolean) => {
        set(state => ({
          user: state.user ? { ...state.user, emailVerified: verified } : null,
        }))
      },
    }),
    {
      name: "solstore_auth",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
