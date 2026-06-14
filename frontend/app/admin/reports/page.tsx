"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import {
  Users, BookOpen, TrendingUp, DollarSign,
  CheckCircle2, XCircle, Loader2, BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  activeCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

interface LoginRecord {
  email: string;
  success: boolean;
  createdAt: string;
  failureReason: string;
}

interface OrderRecord {
  id: number;
  userId: number;
  courseId: number;
  orderCode: number;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  createdAt: string;
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6C8572]">{label}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-[#0A1F12]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#6C8572]">{sub}</p>}
    </div>
  );
}

export default function AdminReportsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => apiRequest<DashboardStats>("/api/v1/admin/dashboard/stats"),
  });

  const { data: logins = [], isLoading: loginsLoading } = useQuery({
    queryKey: ["admin-recent-logins"],
    queryFn: () => apiRequest<LoginRecord[]>("/api/v1/admin/dashboard/recent-logins"),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-reports-orders"],
    queryFn: () => apiRequest<OrderRecord[]>("/api/v1/admin/dashboard/orders"),
  });

  const successLogins = logins.filter((l) => l.success).length;
  const failLogins = logins.filter((l) => !l.success).length;

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const revenue = paidOrders.reduce((s, o) => s + (o.amount ?? 0), 0);

  const statusMap: Record<string, { label: string; cls: string }> = {
    PAID: { label: "Đã thanh toán", cls: "bg-[#DCFCE7] text-[#166534]" },
    PENDING: { label: "Chờ thanh toán", cls: "bg-[#FEF3C7] text-[#B45309]" },
    CANCELLED: { label: "Đã hủy", cls: "bg-[#F1F5F9] text-[#64748B]" },
    FAILED: { label: "Thất bại", cls: "bg-[#FEE2E2] text-[#DC2626]" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-1 border-b border-[#B3CCBC] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Quản trị viên</p>
        <h1 className="mt-0.5 text-2xl font-bold text-[#0A1F12]">Báo cáo & Thống kê</h1>
        <p className="text-sm text-[#6C8572]">Tổng quan hoạt động hệ thống</p>
      </header>

      {/* KPI */}
      {statsLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-[#166534]" /></div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Tổng người dùng" value={stats?.totalUsers ?? 0} color="bg-[#166534]" />
          <StatCard icon={BookOpen} label="Khóa học đang mở" value={stats?.activeCourses ?? 0} color="bg-[#0D5C31]" />
          <StatCard icon={TrendingUp} label="Tổng lượt đăng ký" value={stats?.totalEnrollments ?? 0} color="bg-[#2D6A4C]" />
          <StatCard
            icon={DollarSign}
            label="Doanh thu"
            value={(revenue).toLocaleString("vi-VN") + " ₫"}
            sub={`${paidOrders.length} đơn thành công`}
            color="bg-[#166534]"
          />
        </section>
      )}

      {/* Two columns: Login audit + Orders breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Login audit */}
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
            <h2 className="text-base font-semibold text-[#0A1F12]">Đăng nhập gần đây</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#166534]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {successLogins} thành công
              </span>
              <span className="flex items-center gap-1 text-[#DC2626]">
                <XCircle className="h-3.5 w-3.5" /> {failLogins} thất bại
              </span>
            </div>
          </div>
          {loginsLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-[#166534]" /></div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
              {logins.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#6C8572]">Chưa có dữ liệu</p>
              ) : (
                logins.map((log, i) => (
                  <div key={i} className={`flex items-center gap-3 px-5 py-3 border-b border-[#B3CCBC] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}>
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${log.success ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"}`}>
                      {log.success
                        ? <CheckCircle2 className="h-4 w-4 text-[#166534]" />
                        : <XCircle className="h-4 w-4 text-[#DC2626]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#0A1F12]">{log.email}</p>
                      {!log.success && log.failureReason && (
                        <p className="text-xs text-[#DC2626]">{log.failureReason}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-xs text-[#6C8572]">
                      {new Date(log.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Orders breakdown */}
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
            <h2 className="text-base font-semibold text-[#0A1F12]">Đơn hàng</h2>
            <span className="text-xs text-[#6C8572]">{orders.length} tổng</span>
          </div>

          {/* Status summary */}
          <div className="grid grid-cols-2 gap-3 p-4 border-b border-[#B3CCBC]">
            {[
              { label: "Đã thanh toán", count: paidOrders.length, cls: "bg-[#DCFCE7] text-[#166534]" },
              { label: "Chờ thanh toán", count: pendingOrders.length, cls: "bg-[#FEF3C7] text-[#B45309]" },
              { label: "Đã hủy", count: orders.filter(o => o.status === "CANCELLED").length, cls: "bg-[#F1F5F9] text-[#64748B]" },
              { label: "Thất bại", count: orders.filter(o => o.status === "FAILED").length, cls: "bg-[#FEE2E2] text-[#DC2626]" },
            ].map((s) => (
              <div key={s.label} className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${s.cls}`}>
                <span className="text-xs font-medium">{s.label}</span>
                <span className="text-lg font-bold">{s.count}</span>
              </div>
            ))}
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-[#166534]" /></div>
          ) : (
            <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
              {orders.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#6C8572]">Chưa có đơn hàng</p>
              ) : (
                orders.slice(0, 10).map((order, i) => {
                  const s = statusMap[order.status] ?? { label: order.status, cls: "bg-[#F1F5F9] text-[#64748B]" };
                  return (
                    <div key={order.id} className={`flex items-center gap-3 px-5 py-3 border-b border-[#B3CCBC] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}>
                      <span className="shrink-0 font-mono text-xs text-[#6C8572]">#{order.orderCode ?? order.id}</span>
                      <div className="flex-1" />
                      <span className="text-sm font-semibold text-[#0A1F12]">
                        {(order.amount ?? 0).toLocaleString("vi-VN")} ₫
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bar chart - enrollment by course (simplified) */}
      <div className="rounded-2xl border border-[#B3CCBC] bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-semibold text-[#0A1F12]">Phân bổ trạng thái đơn hàng</h2>
        </div>
        <p className="text-xs text-[#6C8572] mb-5">Tỷ lệ đơn hàng theo trạng thái</p>
        {ordersLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-[#166534]" /></div>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[#6C8572] text-center py-4">Chưa có dữ liệu</p>
        ) : (
          <div className="space-y-3">
            {[
              { label: "Đã thanh toán", count: paidOrders.length, color: "#166534" },
              { label: "Chờ thanh toán", count: pendingOrders.length, color: "#B45309" },
              { label: "Đã hủy / Thất bại", count: orders.filter(o => ["CANCELLED", "FAILED"].includes(o.status)).length, color: "#DC2626" },
            ].map((row) => {
              const pct = orders.length > 0 ? Math.round((row.count / orders.length) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#3E5448]">{row.label}</span>
                    <span className="text-sm font-semibold text-[#0A1F12]">{row.count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#D5EADE]">
                    <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
