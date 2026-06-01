import { apiRequest } from "./client";

export interface AdminDashboardStats {
  totalUsers: number;
  activeCourses: number;
  publishedExams: number;
  monthlyRevenue: number;
}

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

export interface AdminAcademicItem {
  label: string;
  value: string;
  description?: string;
}

export function getAdminDashboardStats() {
  return apiRequest<AdminDashboardStats>('/api/v1/admin/dashboard/stats');
}

export function getAdminUsers() {
  return apiRequest<AdminUserItem[]>('/api/v1/admin/users');
}

export function getAcademicOverview() {
  return apiRequest<AdminAcademicItem[]>('/api/v1/admin/academic/overview');
}
