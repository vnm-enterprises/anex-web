import api from "@/lib/api";
import { User, Session } from "@/types/auth";

/* ---------- AUTH ---------- */
export const authApi = {
  signup: (payload: {
    email: string;
    password: string;
    name?: string;
  }) =>
    api.post("/auth/signup", payload),

  login: (email: string, password: string) =>
    api.post<{ token: string }>("/auth/login", {
      email,
      password,
    }),

  google: (idToken: string) =>
    api.post<{ token: string }>("/auth/google", { idToken }),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),

  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),

  logout: () => api.post("/auth/logout"),

  logoutAll: () => api.post("/auth/logout-all"),

  me: () => api.get<User>("/auth/me"),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/auth/me", data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    }),

  sessions: () => api.get<Session[]>("/auth/sessions"),
};
