import { apiRequest, type Page } from "./client";

export interface AdminDashboardStats {
  totalUsers: number;
  activeCourses: number;
  publishedExams: number;
  monthlyRevenue: number;
}

export interface AdminAcademicItem {
  label: string;
  value: string;
  description?: string;
}

export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
  userType: string;
  phone?: string;
  studentCode?: string;
  staffCode?: string;
  studyStatus?: string;
  active: boolean;
  emailVerifiedAt?: string;
  roles: string[];
}

export interface AdminCreateUserRequest {
  name: string;
  email: string;
  password: string;
  userType: string;
  phone?: string;
  studentCode?: string;
  staffCode?: string;
  studyStatus?: string;
  active?: boolean;
  roles: string[];
}

export interface AdminUpdateUserRequest {
  name?: string;
  email?: string;
  userType?: string;
  phone?: string;
  studentCode?: string;
  staffCode?: string;
  studyStatus?: string;
  active?: boolean;
  roles?: string[];
}

export interface AdminUserListParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  active?: boolean;
  sort?: string;
}

function buildQuery(params: Record<string, unknown>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function getAdminUsers(params: AdminUserListParams = {}) {
  return apiRequest<Page<AdminUserResponse>>(
    `/api/v1/admin/users${buildQuery(params as Record<string, unknown>)}`
  );
}

export function getAdminUser(id: number) {
  return apiRequest<AdminUserResponse>(`/api/v1/admin/users/${id}`);
}

export function createAdminUser(data: AdminCreateUserRequest) {
  return apiRequest<AdminUserResponse>("/api/v1/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminUser(id: number, data: AdminUpdateUserRequest) {
  return apiRequest<AdminUserResponse>(`/api/v1/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deactivateAdminUser(id: number) {
  return apiRequest<void>(`/api/v1/admin/users/${id}`, {
    method: "DELETE",
  });
}

export function getAdminDashboardStats() {
  return apiRequest<AdminDashboardStats>("/api/v1/admin/dashboard/stats");
}

export function getAcademicOverview() {
  return apiRequest<AdminAcademicItem[]>("/api/v1/admin/academic/overview");
}

export interface LoginAuditRecord {
  success: boolean;
  ipAddress: string;
  userAgent: string;
  failReason?: string;
  createdAt: string;
}

export function getUserLoginAudit(userId: number, page = 0, size = 10) {
  return apiRequest<Page<LoginAuditRecord>>(
    `/api/v1/admin/users/${userId}/login-audit?page=${page}&size=${size}`
  );
}
