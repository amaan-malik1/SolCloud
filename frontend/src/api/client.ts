import axios, { type AxiosError } from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("solstore_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: string }>) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("solstore_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    if (status === 429) toast.error("Too many requests — slow down");
    if (status && status >= 500) toast.error("Server error — please try again");
    return Promise.reject(error);
  },
);
