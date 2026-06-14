"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Loader2, Plus, Search, Users, X } from "lucide-react";
import {
  createAdminUser,
  deactivateAdminUser,
  getAdminUsers,
  getUserLoginAudit,
  updateAdminUser,
  type AdminUserResponse,
  type LoginAuditRecord,
} from "@/lib/api";
import { toast } from "sonner";

const ROLES = ["ROLE_ADMIN", "ROLE_INSTRUCTOR", "ROLE_STUDENT"];
const USER_TYPES = ["STUDENT", "STAFF", "ADMIN"];

const EMPTY_CREATE = {
  name: "", email: "", password: "", userType: "STUDENT",
  phone: "", studentCode: "", staffCode: "", roles: ["ROLE_STUDENT"],
};


export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [auditUser, setAuditUser] = useState<AdminUserResponse | null>(null);
  const [auditPage, setAuditPage] = useState(0);

  const createMutation = useMutation({
    mutationFn: () => createAdminUser({
      ...createForm,
      active: true,
    }),
    onSuccess: () => {
      toast.success("Đã tạo người dùng mới!");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setShowCreate(false);
      setCreateForm(EMPTY_CREATE);
    },
    onError: (err: Error) => toast.error(err.message || "Tạo người dùng thất bại"),
  });

  const params = {
    page,
    size: 20,
    search: search || undefined,
    role: role || undefined,
    active: activeFilter === "" ? undefined : activeFilter === "true",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAdminUsers(params),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateAdminUser(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const deactivate = useMutation({
    mutationFn: (id: number) => deactivateAdminUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ["user-audit", auditUser?.id, auditPage],
    queryFn: () => getUserLoginAudit(auditUser!.id, auditPage, 10),
    enabled: !!auditUser,
  });

  const users: AdminUserResponse[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">
            Quản trị viên
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F12]">
            Quản lý người dùng
          </h1>
          <p className="mt-1 text-sm text-[#6C8572]">
            Tổng {totalElements} người dùng. Lọc, khoá và chỉnh sửa vai trò.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
        >
          <Plus className="h-4 w-4" /> Tạo người dùng
        </button>
      </header>

      {/* Table card */}
      <section className="rounded-2xl border border-[#B3CCBC] bg-white">
        {/* Filters */}
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 min-w-[220px] items-center gap-2 h-10 rounded-lg border border-[#6C8572] bg-white px-3 focus-within:border-[#166534] focus-within:ring-[3px] focus-within:ring-[rgba(22,101,52,0.15)] transition">
              <Search className="h-4 w-4 shrink-0 text-[#6C8572]" />
              <input
                value={search}
                onChange={(e) => { setPage(0); setSearch(e.target.value); }}
                placeholder="Tìm theo tên, email, mã SV/CB"
                className="flex-1 bg-transparent text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572]"
              />
            </div>
            <select
              value={role}
              onChange={(e) => { setPage(0); setRole(e.target.value); }}
              className="h-10 rounded-lg border border-[#6C8572] bg-white px-3 text-sm text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
            >
              <option value="">Tất cả vai trò</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.replace("ROLE_", "")}</option>
              ))}
            </select>
            <select
              value={activeFilter}
              onChange={(e) => { setPage(0); setActiveFilter(e.target.value); }}
              className="h-10 rounded-lg border border-[#6C8572] bg-white px-3 text-sm text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Tạm dừng</option>
            </select>
          </div>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#B3CCBC]">
          <Users className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-semibold text-[#0A1F12]">Danh sách người dùng</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Loại</th>
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#6C8572]" />
                  </td>
                </tr>
              )}
              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-[#6C8572]">
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              )}
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${
                    i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-3 font-medium text-[#0A1F12]">{user.name}</td>
                  <td className="px-6 py-3 text-[#3E5448]">{user.email}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <span
                          key={r}
                          className="rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534]"
                        >
                          {r.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[#6C8572]">{user.userType}</td>
                  <td className="px-6 py-3 text-[#6C8572]">
                    {user.studentCode || user.staffCode || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.active
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      {user.active ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setAuditUser(user); setAuditPage(0); }}
                        className="flex h-8 items-center gap-1 rounded-lg border border-[#B3CCBC] bg-white px-3 text-xs font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        Audit
                      </button>
                      <button
                        onClick={() => toggleActive.mutate({ id: user.id, active: !user.active })}
                        disabled={toggleActive.isPending}
                        className="h-8 rounded-lg border border-[#B3CCBC] bg-white px-3 text-xs font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-50"
                      >
                        {user.active ? "Tắt" : "Bật"}
                      </button>
                      {user.active && (
                        <button
                          onClick={() => {
                            if (confirm(`Vô hiệu hoá tài khoản ${user.email}?`)) {
                              deactivate.mutate(user.id);
                            }
                          }}
                          className="h-8 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-3 text-xs font-medium text-[#DC2626] transition hover:bg-[#FEE2E2]"
                        >
                          Khoá
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#B3CCBC]">
          <span className="text-sm text-[#6C8572]">
            Trang {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className="h-9 rounded-lg border border-[#B3CCBC] px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
            >
              ← Trước
            </button>
            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 rounded-lg border border-[#B3CCBC] px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
            >
              Sau →
            </button>
          </div>
        </div>
      </section>

      {/* Summary */}
      <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6C8572]">Tổng người dùng</span>
          <Users className="h-5 w-5 text-[#166534]" />
        </div>
        <div className="mt-4 text-3xl font-bold text-[#0A1F12]">{totalElements}</div>
      </div>

      {/* Audit modal */}
      {auditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4" onClick={() => setAuditUser(null)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-[#B3CCBC] bg-white shadow-[0_4px_32px_rgba(13,92,49,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F12]">Lịch sử đăng nhập</h3>
                <p className="text-sm text-[#6C8572]">{auditUser.name}</p>
              </div>
              <button
                onClick={() => setAuditUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6C8572] transition hover:bg-[#D5EADE] hover:text-[#0A1F12]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                    <th className="px-5 py-3">Thời gian</th>
                    <th className="px-5 py-3">Địa chỉ IP</th>
                    <th className="px-5 py-3">Trạng thái</th>
                    <th className="px-5 py-3">Lý do thất bại</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLoading && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#6C8572]" />
                      </td>
                    </tr>
                  )}
                  {!auditLoading && (auditData?.content ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-6 text-center text-sm text-[#6C8572]">
                        Chưa có lịch sử đăng nhập.
                      </td>
                    </tr>
                  )}
                  {(auditData?.content ?? []).map((record: LoginAuditRecord, i: number) => (
                    <tr
                      key={i}
                      className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                    >
                      <td className="px-5 py-3 text-[#3E5448] whitespace-nowrap">
                        {new Date(record.createdAt).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-5 py-3 font-mono text-[#0A1F12]">{record.ipAddress}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          record.success
                            ? "bg-[#DCFCE7] text-[#166534]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}>
                          {record.success ? "Thành công" : "Thất bại"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#6C8572]">{record.failReason ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#B3CCBC] px-6 py-4">
              <span className="text-sm text-[#6C8572]">
                Trang {auditPage + 1} / {Math.max(auditData?.totalPages ?? 1, 1)}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={auditPage === 0}
                  onClick={() => setAuditPage((p) => Math.max(p - 1, 0))}
                  className="h-9 rounded-lg border border-[#B3CCBC] px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
                >
                  ← Trước
                </button>
                <button
                  disabled={auditPage + 1 >= (auditData?.totalPages ?? 1)}
                  onClick={() => setAuditPage((p) => p + 1)}
                  className="h-9 rounded-lg border border-[#B3CCBC] px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create user dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4" onClick={() => setShowCreate(false)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[#B3CCBC] bg-white shadow-[0_4px_32px_rgba(13,92,49,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-bold text-[#0A1F12]">Tạo người dùng mới</h3>
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Họ và tên *", key: "name", placeholder: "Nguyễn Văn A" },
                { label: "Email *", key: "email", type: "email", placeholder: "user@ptit.edu.vn" },
                { label: "Mật khẩu *", key: "password", type: "password", placeholder: "Min. 8 ký tự" },
                { label: "Số điện thoại", key: "phone", placeholder: "0912345678" },
                { label: "Mã sinh viên", key: "studentCode", placeholder: "B21DCCN123" },
                { label: "Mã cán bộ", key: "staffCode", placeholder: "GV001" },
              ].map(({ label, key, type = "text", placeholder }) => (
                <div key={key}>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">{label}</label>
                  <input
                    type={type}
                    value={(createForm as any)[key]}
                    onChange={(e) => setCreateForm({ ...createForm, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Loại người dùng</label>
                <select
                  value={createForm.userType}
                  onChange={(e) => setCreateForm({ ...createForm, userType: e.target.value })}
                  className="h-11 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                >
                  {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Vai trò</label>
                <select
                  value={createForm.roles[0]}
                  onChange={(e) => setCreateForm({ ...createForm, roles: [e.target.value] })}
                  className="h-11 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace("ROLE_", "")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#B3CCBC] px-6 py-4">
              <button onClick={() => setShowCreate(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]">Hủy</button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !createForm.name || !createForm.email || !createForm.password}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Tạo người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
