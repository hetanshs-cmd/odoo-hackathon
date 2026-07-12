import { api } from "./api";
import type { ApiResponse, User } from "../types";

export interface RegisterDto {
  fullName: string;
  email: string;
  passwordHash: string; // The requirement implies a backend validation, but frontend will send raw string normally. Wait, the prompt says password. We'll send password.
}

// Adjusting based on actual frontend submission
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    const res = await api.post<ApiResponse<{ tempId: string }>>("/auth/register", data);
    return res.data;
  },
  
  verifyEmail: async (data: { email: string; otp: string }) => {
    const res = await api.post<ApiResponse<null>>("/auth/register/verify", data);
    return res.data;
  },

  login: async (data: LoginPayload) => {
    const res = await api.post<ApiResponse<{ requireOtp: boolean, tempToken?: string, token?: string, user?: User }>>("/auth/login", data);
    return res.data;
  },

  verifyLoginOtp: async (data: { email: string; otp: string }) => {
    const res = await api.post<ApiResponse<{ token: string, user: User }>>("/auth/login/verify", data);
    return res.data;
  },

  forgotPassword: async (data: { email: string }) => {
    const res = await api.post<ApiResponse<null>>("/auth/forgot-password", data);
    return res.data;
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    const res = await api.post<ApiResponse<null>>("/auth/reset-password", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },

  me: async () => {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data;
  }
};
