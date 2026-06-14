"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Shield, Trash2, X } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { toast } from "sonner";

/* ── Types ── */
interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

/* ── API helpers ── */
const getRoles = () => apiRequest<Role[]>("/api/v1/admin/rbac/roles");
const getPermissions = () => apiRequest<Permission[]>("/api/v1/admin/rbac/permissions");
const createRole = (name: string) =>
  apiRequest<Role>("/api/v1/admin/rbac/roles", { method: "POST", body: JSON.stringify({ name }) });
const deleteRole = (id: number) =>
  apiRequest<void>(`/api/v1/admin/rbac/roles/${id}`, { method: "DELETE" });
const createPermission = (name: string) =>
  apiRequest<Permission>("/api/v1/admin/rbac/permissions", { method: "POST", body: JSON.stringify({ name }) });
const deletePermission = (id: number) =>
  apiRequest<void>(`/api/v1/admin/rbac/permissions/${id}`, { method: "DELETE" });
const assignPermissions = (roleId: number, permIds: number[]) =>
  apiRequest<void>(`/api/v1/admin/rbac/roles/${roleId}/permissions`, {
    method: "POST",
    body: JSON.stringify(permIds),
  });
const removePermission = (roleId: number, permId: number) =>
  apiRequest<void>(`/api/v1/admin/rbac/roles/${roleId}/permissions/${permId}`, { method: "DELETE" });

export default function RbacPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");

  /* ── Role state ── */
  const [newRoleName, setNewRoleName] = useState("");
  const [assignTarget, setAssignTarget] = useState<Role | null>(null);
  const [checkedPerms, setCheckedPerms] = useState<Set<number>>(new Set());

  /* ── Permission state ── */
  const [newPermName, setNewPermName] = useState("");

  /* ── Queries ── */
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["rbac-roles"],
    queryFn: getRoles,
  });

  const { data: permissions = [], isLoading: permsLoading } = useQuery({
    queryKey: ["rbac-permissions"],
    queryFn: getPermissions,
  });

  /* ── Mutations: Roles ── */
  const createRoleMutation = useMutation({
    mutationFn: () => createRole(newRoleName.trim()),
    onSuccess: () => {
      toast.success("Đã tạo vai trò!");
      setNewRoleName("");
      qc.invalidateQueries({ queryKey: ["rbac-roles"] });
    },
    onError: () => toast.error("Không thể tạo vai trò."),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      toast.success("Đã xóa vai trò.");
      qc.invalidateQueries({ queryKey: ["rbac-roles"] });
    },
    onError: () => toast.error("Không thể xóa vai trò."),
  });

  const assignMutation = useMutation({
    mutationFn: () => assignPermissions(assignTarget!.id, Array.from(checkedPerms)),
    onSuccess: () => {
      toast.success("Đã gán quyền!");
      setAssignTarget(null);
      qc.invalidateQueries({ queryKey: ["rbac-roles"] });
    },
    onError: () => toast.error("Không thể gán quyền."),
  });

  const removePermMutation = useMutation({
    mutationFn: ({ roleId, permId }: { roleId: number; permId: number }) =>
      removePermission(roleId, permId),
    onSuccess: () => {
      toast.success("Đã gỡ quyền.");
      qc.invalidateQueries({ queryKey: ["rbac-roles"] });
    },
    onError: () => toast.error("Không thể gỡ quyền."),
  });

  /* ── Mutations: Permissions ── */
  const createPermMutation = useMutation({
    mutationFn: () => createPermission(newPermName.trim()),
    onSuccess: () => {
      toast.success("Đã tạo quyền hạn!");
      setNewPermName("");
      qc.invalidateQueries({ queryKey: ["rbac-permissions"] });
    },
    onError: () => toast.error("Không thể tạo quyền hạn."),
  });

  const deletePermMutation = useMutation({
    mutationFn: (id: number) => deletePermission(id),
    onSuccess: () => {
      toast.success("Đã xóa quyền hạn.");
      qc.invalidateQueries({ queryKey: ["rbac-permissions"] });
    },
    onError: () => toast.error("Không thể xóa quyền hạn."),
  });

  /* ── Assign dialog open handler ── */
  const openAssign = (role: Role) => {
    setAssignTarget(role);
    setCheckedPerms(new Set(role.permissions.map((p) => p.id)));
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">
            Quản trị viên
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F12]">
            Phân quyền (RBAC)
          </h1>
          <p className="mt-1 text-sm text-[#6C8572]">
            Quản lý vai trò và quyền hạn trong hệ thống.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#B3CCBC] bg-[#EEF7F2] p-1 w-fit">
        {(["roles", "permissions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-[#166534] text-white shadow-sm"
                : "text-[#3E5448] hover:bg-white"
            }`}
          >
            {tab === "roles" ? "Vai trò" : "Quyền hạn"}
          </button>
        ))}
      </div>

      {/* ── Roles Tab ── */}
      {activeTab === "roles" && (
        <section className="space-y-6">
          {/* Create role */}
          <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[#0A1F12]">
              <Shield className="h-5 w-5 text-[#166534]" />
              Tạo vai trò mới
            </h2>
            <div className="flex gap-3">
              <input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Tên vai trò (vd: ROLE_MODERATOR)"
                className="flex-1 h-11 rounded-xl border border-[#6C8572] bg-white px-4 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                onKeyDown={(e) => e.key === "Enter" && newRoleName.trim() && createRoleMutation.mutate()}
              />
              <button
                onClick={() => createRoleMutation.mutate()}
                disabled={createRoleMutation.isPending || !newRoleName.trim()}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {createRoleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Tạo vai trò
              </button>
            </div>
          </div>

          {/* Role list */}
          {rolesLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
            </div>
          ) : roles.length === 0 ? (
            <p className="text-center text-sm text-[#6C8572] py-8">Chưa có vai trò nào.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(roles as Role[]).map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-[#B3CCBC] bg-white p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF7F2]">
                        <Shield className="h-4 w-4 text-[#166534]" />
                      </div>
                      <p className="font-semibold text-[#0A1F12] text-sm">{role.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Xóa vai trò "${role.name}"?`)) deleteRoleMutation.mutate(role.id);
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] text-[#DC2626] transition hover:bg-[#FEE2E2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Permission badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {role.permissions.length === 0 ? (
                      <span className="text-xs text-[#6C8572]">Chưa có quyền nào</span>
                    ) : (
                      role.permissions.map((p) => (
                        <span
                          key={p.id}
                          className="group relative flex items-center gap-1 rounded-full bg-[#EEF7F2] px-2 py-0.5 text-xs font-medium text-[#166534]"
                        >
                          {p.name}
                          <button
                            onClick={() => removePermMutation.mutate({ roleId: role.id, permId: p.id })}
                            className="text-[#166534]/60 hover:text-[#DC2626] transition"
                            title="Gỡ quyền"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => openAssign(role)}
                    className="mt-auto flex h-9 items-center justify-center gap-2 rounded-lg border border-[#2D6A4C] text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
                  >
                    <Plus className="h-4 w-4" />
                    Gán quyền
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Permissions Tab ── */}
      {activeTab === "permissions" && (
        <section className="space-y-6">
          {/* Create permission */}
          <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
            <h2 className="mb-4 text-base font-semibold text-[#0A1F12]">Tạo quyền hạn mới</h2>
            <div className="flex gap-3">
              <input
                value={newPermName}
                onChange={(e) => setNewPermName(e.target.value)}
                placeholder="Tên quyền (vd: COURSE_CREATE)"
                className="flex-1 h-11 rounded-xl border border-[#6C8572] bg-white px-4 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                onKeyDown={(e) => e.key === "Enter" && newPermName.trim() && createPermMutation.mutate()}
              />
              <button
                onClick={() => createPermMutation.mutate()}
                disabled={createPermMutation.isPending || !newPermName.trim()}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {createPermMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Tạo quyền
              </button>
            </div>
          </div>

          {/* Permissions table */}
          <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
            <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
              <p className="text-sm font-semibold text-[#0A1F12]">
                Danh sách quyền hạn ({(permissions as Permission[]).length})
              </p>
            </div>
            {permsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Tên quyền</th>
                      <th className="px-6 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(permissions as Permission[]).length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-[#6C8572]">
                          Chưa có quyền hạn nào.
                        </td>
                      </tr>
                    )}
                    {(permissions as Permission[]).map((perm, i) => (
                      <tr
                        key={perm.id}
                        className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                      >
                        <td className="px-6 py-3 text-[#6C8572] font-mono">{perm.id}</td>
                        <td className="px-6 py-3 font-medium text-[#0A1F12]">{perm.name}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => {
                              if (confirm(`Xóa quyền "${perm.name}"?`)) deletePermMutation.mutate(perm.id);
                            }}
                            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-3 text-xs font-medium text-[#DC2626] transition hover:bg-[#FEE2E2]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Assign Permissions Dialog ── */}
      {assignTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
          onClick={() => setAssignTarget(null)}
        >
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white shadow-[0_4px_32px_rgba(13,92,49,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F12]">Gán quyền</h3>
                <p className="text-sm text-[#6C8572]">{assignTarget.name}</p>
              </div>
              <button
                onClick={() => setAssignTarget(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6C8572] transition hover:bg-[#D5EADE] hover:text-[#0A1F12]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-2 max-h-[50vh] overflow-y-auto">
              {(permissions as Permission[]).length === 0 ? (
                <p className="text-sm text-[#6C8572]">Chưa có quyền hạn nào trong hệ thống.</p>
              ) : (
                (permissions as Permission[]).map((perm) => {
                  const checked = checkedPerms.has(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className="flex items-center gap-3 rounded-xl border border-[#B3CCBC] px-4 py-3 cursor-pointer transition hover:bg-[#EEF7F2]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = new Set(checkedPerms);
                          if (checked) next.delete(perm.id);
                          else next.add(perm.id);
                          setCheckedPerms(next);
                        }}
                        className="h-4 w-4 accent-[#166534] rounded"
                      />
                      <span className="text-sm font-medium text-[#0A1F12]">{perm.name}</span>
                    </label>
                  );
                })
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-[#B3CCBC] px-6 py-4">
              <button
                onClick={() => setAssignTarget(null)}
                className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
              >
                Hủy
              </button>
              <button
                onClick={() => assignMutation.mutate()}
                disabled={assignMutation.isPending}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {assignMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
