"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, ChevronRight, CircleDollarSign,
  GraduationCap, Loader2, ShieldCheck, Users,
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  activeCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}
interface RecentUser {
  id: number;
  name: string;
  email: string;
  userType: string;
  active: boolean;
  roles: string[];
}
interface RecentLogin {
  email: string;
  success: boolean;
  createdAt: string;
  failureReason: string;
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiRequest<AdminStats>("/api/v1/admin/dashboard/stats"),
  });

  const { data: recentUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: () => apiRequest<RecentUser[]>("/api/v1/admin/dashboard/recent-users"),
  });

  const { data: recentLogins = [] } = useQuery({
    queryKey: ["admin-recent-logins"],
    queryFn: () => apiRequest<RecentLogin[]>("/api/v1/admin/dashboard/recent-logins"),
  });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Quản trị viên</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F12]">Trung tâm điều hành</h1>
          <p className="mt-1 text-sm text-[#6C8572]">Tổng quan hệ thống theo thời gian thực</p>
        </div>
        <Link
          href="/admin/users"
          className="inline-flex h-10 items-center rounded-lg border border-[#2D6A4C] bg-[#EEF7F2] px-4 text-sm font-semibold text-[#166534] transition hover:bg-[#D5EADE]"
        >
          Quản lý người dùng →
        </Link>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <div className="col-span-4 flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-[#6C8572]" />
          </div>
        ) : (
          <>
            <StatCard
              label="Tổng người dùng"
              value={stats?.totalUsers ?? 0}
              icon={<Users className="h-5 w-5 text-[#166534]" />}
            />
            <StatCard
              label="Khóa học đang mở"
              value={stats?.activeCourses ?? 0}
              icon={<BookOpen className="h-5 w-5 text-[#166534]" />}
            />
            <StatCard
              label="Lượt đăng ký"
              value={stats?.totalEnrollments ?? 0}
              icon={<GraduationCap className="h-5 w-5 text-[#166534]" />}
            />
            <StatCard
              label="Doanh thu (VNĐ)"
              value={(stats?.totalRevenue ?? 0).toLocaleString("vi-VN")}
              icon={<CircleDollarSign className="h-5 w-5 text-[#166534]" />}
            />
          </>
        )}
      </section>

      {/* Main panels */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Recent users table */}
        <div className="rounded-2xl border border-[#B3CCBC] bg-white">
          <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
            <div>
              <h2 className="text-lg font-semibold text-[#0A1F12]">Người dùng gần đây</h2>
              <p className="mt-0.5 text-sm text-[#6C8572]">8 tài khoản mới nhất</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-[#166534] transition hover:text-[#0D5C31]"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr] bg-[#EEF7F2] px-6 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
              <span>Tên</span>
              <span>Vai trò</span>
              <span>Trạng thái</span>
            </div>

            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#6C8572]" />
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[#6C8572]">
                Chưa có người dùng
              </div>
            ) : (
              recentUsers.map((u, i) => (
                <div
                  key={u.id}
                  className={`grid grid-cols-[1.6fr_0.8fr_0.8fr] items-center border-b border-[#B3CCBC] px-6 py-3 text-sm transition hover:bg-[#E2F1E9] ${
                    i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#0A1F12]">{u.name}</p>
                    <p className="truncate text-xs text-[#6C8572]">{u.email}</p>
                  </div>
                  <span className="text-xs text-[#3E5448]">
                    {u.roles[0]?.replace("ROLE_", "") ?? u.userType}
                  </span>
                  <span
                    className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.active
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {u.active ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick actions */}
          <div className="rounded-2xl border border-[#B3CCBC] bg-white">
            <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <ShieldCheck className="h-5 w-5 text-[#166534]" />
              <h2 className="text-lg font-semibold text-[#0A1F12]">Thao tác nhanh</h2>
            </div>
            <div className="p-5 space-y-2">
              {[
                { label: "Quản lý người dùng", href: "/admin/users" },
                { label: "Quản lý học thuật", href: "/admin/academic" },
                { label: "Danh sách khóa học", href: "/courses" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-[#B3CCBC] px-4 py-3 text-sm font-medium text-[#0A1F12] transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#6C8572]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent logins */}
          <div className="rounded-2xl border border-[#B3CCBC] bg-white">
            <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <h2 className="text-lg font-semibold text-[#0A1F12]">Đăng nhập gần đây</h2>
            </div>
            <div className="p-5 space-y-2">
              {recentLogins.length === 0 ? (
                <p className="text-sm text-[#6C8572]">Chưa có hoạt động</p>
              ) : (
                recentLogins.slice(0, 6).map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[#B3CCBC] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="max-w-[160px] truncate text-xs font-medium text-[#0A1F12]">
                        {log.email}
                      </p>
                      <p className="text-xs text-[#6C8572]">
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        log.success
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {log.success ? "OK" : log.failureReason || "Thất bại"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* System status */}
      <section className="rounded-2xl border border-[#B3CCBC] bg-white">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-[#0A1F12]">Trạng thái hệ thống</h2>
        </div>
        <div className="p-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {[
            { name: "Auth Service", ok: true },
            { name: "Course Service", ok: true },
            { name: "Exam Service", ok: true },
            { name: "Payment Service", ok: true },
            { name: "Notification", ok: true },
            { name: "API Gateway", ok: true },
            { name: "AI Service", ok: false, note: "Chưa triển khai" },
            { name: "Media / MinIO", ok: false, note: "Cần cấu hình" },
          ].map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] p-4"
            >
              <p className="text-sm font-medium text-[#3E5448]">{s.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.ok ? "bg-[#166534]" : "bg-[#B45309]"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    s.ok ? "text-[#166534]" : "text-[#B45309]"
                  }`}
                >
                  {s.ok ? "Healthy" : s.note ?? "Warning"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6C8572]">{label}</span>
        {icon}
      </div>
      <div className="mt-4 text-3xl font-bold text-[#0A1F12]">{value}</div>
    </div>
  );
}
