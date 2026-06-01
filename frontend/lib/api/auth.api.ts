import { apiRequest } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  name: string;
  email: string;
  roles?: string[];
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  userType: string;
  active: boolean;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}

export function login(data: LoginRequest) {
  return apiRequest<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiRequest<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function forgotPassword(data: ForgotPasswordRequest) {
  return apiRequest<MessageResponse>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPassword(data: ResetPasswordRequest) {
  return apiRequest<MessageResponse>("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function refreshToken(refreshTokenValue: string) {
  return apiRequest<AuthResponse>("/api/v1/auth/refresh", {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshTokenValue,
    },
  });
}

export function getMe(userId: number) {
  return apiRequest<UserResponse>("/api/v1/auth/me", {
    headers: {
      "X-User-Id": String(userId),
    },
  });
}

export function logout(refreshTokenValue: string) {
  return apiRequest<void>("/api/v1/auth/logout", {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshTokenValue,
    },
  });
}
