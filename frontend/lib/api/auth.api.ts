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
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  dateOfBirth?: string;
  hometown?: string;
  permanentAddress?: string;
}

export interface VerifyEmailRequest {
  token: string;
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

export function getMe() {
  return apiRequest<UserResponse>("/api/v1/auth/me", {
    method: "GET"
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

export function logoutAll() {
  return apiRequest<void>("/api/v1/auth/logout-all", {
    method: "POST",
  });
}

export function changePassword(data: ChangePasswordRequest) {
  return apiRequest<MessageResponse>("/api/v1/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function verifyEmail(data: VerifyEmailRequest) {
  return apiRequest<MessageResponse>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resendVerificationEmail() {
  return apiRequest<MessageResponse>("/api/v1/auth/resend-verification", {
    method: "POST",
  });
}

export function updateProfile(data: UpdateProfileRequest) {
  return apiRequest<UserResponse>("/api/v1/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
