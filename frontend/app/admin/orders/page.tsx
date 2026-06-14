"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { Loader2, ShoppingBag } from "lucide-react";

interface OrderAdmin {
  id: number;
  userId: number;
  courseId: number;
  orderCode: number;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string;
  createdAt: string;
  userName?: string;
  courseTitle?: string;
}

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => apiRequest<OrderAdmin[]>("/api/v1/admin/dashboard/orders"),
  });

  const totalRevenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + (o.amount ?? 0), 0);

  const statusLabel: Record<string, { label: string; cls: string }> = {
    PAID: { label: "Đã thanh toán", cls: "bg-[#DCFCE7] text-[#166534]" },
    PENDING: { label: "Chờ thanh toán", cls: "bg-[#FEF3C7] text-[#B45309]" },
    CANCELLED: { label: "Đã hủy", cls: "bg-[#F1F5F9] text-[#64748B]" },
    FAILED: { label: "Thất bại", cls: "bg-[#FEE2E2] text-[#DC2626]" },
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Quản trị viên</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0A1F12]">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-[#6C8572]">Tổng {orders.length} đơn hàng</p>
        </div>
        <div className="rounded-xl border border-[#B3CCBC] bg-white px-5 py-3 text-center">
          <p className="text-xs text-[#6C8572]">Doanh thu đã thu</p>
          <p className="text-xl font-bold text-[#0D5C31]">{totalRevenue.toLocaleString("vi-VN")} ₫</p>
        </div>
      </header>

      <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
          <h2 className="text-base font-semibold text-[#0A1F12]">Danh sách đơn hàng</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <ShoppingBag className="h-10 w-10 text-[#B3CCBC]" />
            <p className="mt-3 text-sm text-[#6C8572]">Chưa có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  <th className="px-6 py-3 text-left">Mã đơn</th>
                  <th className="px-6 py-3 text-left">Người dùng</th>
                  <th className="px-6 py-3 text-left">Khóa học</th>
                  <th className="px-6 py-3 text-left">Số tiền</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Ngày tạo</th>
                  <th className="px-6 py-3 text-left">Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const status = statusLabel[order.status] ?? {
                    label: order.status,
                    cls: "bg-[#F1F5F9] text-[#64748B]",
                  };
                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                    >
                      <td className="px-6 py-3 font-mono text-sm font-medium text-[#0A1F12]">
                        #{order.orderCode ?? order.id}
                      </td>
                      <td className="px-6 py-3 text-[#3E5448]">
                        {order.userName ?? `User #${order.userId}`}
                      </td>
                      <td className="px-6 py-3 text-[#3E5448]">
                        {order.courseTitle ?? `Course #${order.courseId}`}
                      </td>
                      <td className="px-6 py-3 font-semibold text-[#0A1F12]">
                        {(order.amount ?? 0).toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="px-6 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-[#6C8572]">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-3 text-[#6C8572]">
                        {order.paidAt ? new Date(order.paidAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
