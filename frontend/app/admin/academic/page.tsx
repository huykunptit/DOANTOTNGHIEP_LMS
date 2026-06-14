"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { Loader2, Plus, Pencil, Trash2, X, Building2, Layers, Briefcase } from "lucide-react";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface Institution {
  id: number; code: string; name: string; shortName: string;
  description?: string; active: boolean;
}
interface Unit {
  id: number; institutionId: number; parentId?: number;
  code: string; name: string; level: number; type?: string; active: boolean;
}
interface Position {
  id: number; code: string; name: string; scopeLevel?: string;
  description?: string; active: boolean;
}

// ── API helpers ───────────────────────────────────────────────────────────────

const api = {
  institutions: {
    list: () => apiRequest<Institution[]>("/api/v1/institutions"),
    create: (d: Omit<Institution, "id">) =>
      apiRequest<Institution>("/api/v1/institutions", { method: "POST", body: JSON.stringify(d) }),
    update: (id: number, d: Partial<Institution>) =>
      apiRequest<Institution>(`/api/v1/institutions/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    remove: (id: number) => apiRequest<void>(`/api/v1/institutions/${id}`, { method: "DELETE" }),
  },
  units: {
    list: () => apiRequest<Unit[]>("/api/v1/units"),
    create: (d: Omit<Unit, "id">) =>
      apiRequest<Unit>("/api/v1/units", { method: "POST", body: JSON.stringify(d) }),
    update: (id: number, d: Partial<Unit>) =>
      apiRequest<Unit>(`/api/v1/units/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    remove: (id: number) => apiRequest<void>(`/api/v1/units/${id}`, { method: "DELETE" }),
  },
  positions: {
    list: () => apiRequest<Position[]>("/api/v1/positions"),
    create: (d: Omit<Position, "id">) =>
      apiRequest<Position>("/api/v1/positions", { method: "POST", body: JSON.stringify(d) }),
    update: (id: number, d: Partial<Position>) =>
      apiRequest<Position>(`/api/v1/positions/${id}`, { method: "PUT", body: JSON.stringify(d) }),
    remove: (id: number) => apiRequest<void>(`/api/v1/positions/${id}`, { method: "DELETE" }),
  },
};

// ── Reusable components ───────────────────────────────────────────────────────

const FIELD_CLS = "h-11 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-sm text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition";
const LABEL_CLS = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#F1F5F9] text-[#64748B]"
    }`}>
      {active ? "Hoạt động" : "Không hoạt động"}
    </span>
  );
}

// ── Institutions tab ──────────────────────────────────────────────────────────

function InstitutionsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Institution> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ["institutions"], queryFn: api.institutions.list,
  });

  const saveMutation = useMutation({
    mutationFn: (d: Partial<Institution>) =>
      d.id ? api.institutions.update(d.id, d) : api.institutions.create(d as Omit<Institution, "id">),
    onSuccess: () => {
      toast.success(editing?.id ? "Đã cập nhật!" : "Đã tạo mới!");
      qc.invalidateQueries({ queryKey: ["institutions"] });
      setEditing(null); setShowForm(false);
    },
    onError: () => toast.error("Thao tác thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: api.institutions.remove,
    onSuccess: () => { toast.success("Đã xóa."); qc.invalidateQueries({ queryKey: ["institutions"] }); },
    onError: () => toast.error("Không thể xóa."),
  });

  const openCreate = () => {
    setEditing({ code: "", name: "", shortName: "", description: "", active: true });
    setShowForm(true);
  };
  const openEdit = (item: Institution) => { setEditing({ ...item }); setShowForm(true); };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]">
          <Plus className="h-4 w-4" /> Thêm đơn vị
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#166534]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                <th className="px-5 py-3 text-left">Mã</th>
                <th className="px-5 py-3 text-left">Tên</th>
                <th className="px-5 py-3 text-left">Tên tắt</th>
                <th className="px-5 py-3 text-left">Trạng thái</th>
                <th className="px-5 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {institutions.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-[#6C8572]">Chưa có dữ liệu</td></tr>
              )}
              {institutions.map((item, i) => (
                <tr key={item.id} className={`border-b border-[#B3CCBC] hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[#3E5448]">{item.code}</td>
                  <td className="px-5 py-3 font-medium text-[#0A1F12]">{item.name}</td>
                  <td className="px-5 py-3 text-[#6C8572]">{item.shortName}</td>
                  <td className="px-5 py-3"><StatusBadge active={item.active} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="flex h-7 items-center gap-1 rounded-lg border border-[#B3CCBC] bg-white px-2.5 text-xs font-medium text-[#3E5448] hover:bg-[#EEF7F2]">
                        <Pencil className="h-3 w-3" /> Sửa
                      </button>
                      <button onClick={() => { if (confirm("Xóa đơn vị này?")) deleteMutation.mutate(item.id); }}
                        className="flex h-7 items-center gap-1 rounded-lg border border-[#FEE2E2] bg-white px-2.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2]">
                        <Trash2 className="h-3 w-3" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#0A1F12]">{editing.id ? "Sửa đơn vị" : "Thêm đơn vị"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-[#6C8572] hover:bg-[#EEF7F2]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={LABEL_CLS}>Mã đơn vị *</label>
                <input className={FIELD_CLS} value={editing.code ?? ""} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="VD: PTIT" /></div>
              <div><label className={LABEL_CLS}>Tên đầy đủ *</label>
                <input className={FIELD_CLS} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="VD: Học viện Công nghệ BCVT" /></div>
              <div><label className={LABEL_CLS}>Tên tắt</label>
                <input className={FIELD_CLS} value={editing.shortName ?? ""} onChange={(e) => setEditing({ ...editing, shortName: e.target.value })} placeholder="VD: PTIT" /></div>
              <div><label className={LABEL_CLS}>Mô tả</label>
                <input className={FIELD_CLS} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active-inst" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-[#166534]" />
                <label htmlFor="active-inst" className="text-sm text-[#3E5448]">Đang hoạt động</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] hover:bg-[#EEF7F2]">Hủy</button>
              <button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending || !editing.code || !editing.name}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white hover:bg-[#0D5C31] disabled:opacity-45">
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Units tab ─────────────────────────────────────────────────────────────────

function UnitsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Unit> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: units = [], isLoading } = useQuery({ queryKey: ["units"], queryFn: api.units.list });
  const { data: institutions = [] } = useQuery({ queryKey: ["institutions"], queryFn: api.institutions.list });

  const saveMutation = useMutation({
    mutationFn: (d: Partial<Unit>) =>
      d.id ? api.units.update(d.id, d) : api.units.create(d as Omit<Unit, "id">),
    onSuccess: () => {
      toast.success(editing?.id ? "Đã cập nhật!" : "Đã tạo mới!");
      qc.invalidateQueries({ queryKey: ["units"] });
      setEditing(null); setShowForm(false);
    },
    onError: () => toast.error("Thao tác thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: api.units.remove,
    onSuccess: () => { toast.success("Đã xóa."); qc.invalidateQueries({ queryKey: ["units"] }); },
    onError: () => toast.error("Không thể xóa."),
  });

  const openCreate = () => {
    setEditing({ code: "", name: "", level: 1, active: true });
    setShowForm(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#166534] px-4 text-sm font-semibold text-white hover:bg-[#0D5C31]">
          <Plus className="h-4 w-4" /> Thêm đơn vị con
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#166534]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                <th className="px-5 py-3 text-left">Mã</th>
                <th className="px-5 py-3 text-left">Tên</th>
                <th className="px-5 py-3 text-left">Loại</th>
                <th className="px-5 py-3 text-left">Cấp độ</th>
                <th className="px-5 py-3 text-left">Trạng thái</th>
                <th className="px-5 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {units.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-[#6C8572]">Chưa có dữ liệu</td></tr>
              )}
              {units.map((item, i) => (
                <tr key={item.id} className={`border-b border-[#B3CCBC] hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[#3E5448]">{item.code}</td>
                  <td className="px-5 py-3 font-medium text-[#0A1F12]">{item.name}</td>
                  <td className="px-5 py-3 text-[#6C8572]">{item.type ?? "—"}</td>
                  <td className="px-5 py-3 text-center text-[#3E5448]">{item.level}</td>
                  <td className="px-5 py-3"><StatusBadge active={item.active} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing({ ...item }); setShowForm(true); }}
                        className="flex h-7 items-center gap-1 rounded-lg border border-[#B3CCBC] bg-white px-2.5 text-xs font-medium text-[#3E5448] hover:bg-[#EEF7F2]">
                        <Pencil className="h-3 w-3" /> Sửa
                      </button>
                      <button onClick={() => { if (confirm("Xóa đơn vị này?")) deleteMutation.mutate(item.id); }}
                        className="flex h-7 items-center gap-1 rounded-lg border border-[#FEE2E2] bg-white px-2.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2]">
                        <Trash2 className="h-3 w-3" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#0A1F12]">{editing.id ? "Sửa đơn vị" : "Thêm đơn vị"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-[#6C8572] hover:bg-[#EEF7F2]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={LABEL_CLS}>Mã *</label>
                <input className={FIELD_CLS} value={editing.code ?? ""} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></div>
              <div><label className={LABEL_CLS}>Tên *</label>
                <input className={FIELD_CLS} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className={LABEL_CLS}>Thuộc đơn vị</label>
                <select className={FIELD_CLS} value={editing.institutionId ?? ""} onChange={(e) => setEditing({ ...editing, institutionId: Number(e.target.value) || undefined })}>
                  <option value="">-- Chọn --</option>
                  {institutions.map((inst) => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LABEL_CLS}>Loại</label>
                  <input className={FIELD_CLS} value={editing.type ?? ""} onChange={(e) => setEditing({ ...editing, type: e.target.value })} placeholder="Khoa, Bộ môn..." /></div>
                <div><label className={LABEL_CLS}>Cấp độ</label>
                  <input type="number" min={1} className={FIELD_CLS} value={editing.level ?? 1} onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active-unit" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-[#166534]" />
                <label htmlFor="active-unit" className="text-sm text-[#3E5448]">Đang hoạt động</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] hover:bg-[#EEF7F2]">Hủy</button>
              <button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending || !editing.code || !editing.name}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white hover:bg-[#0D5C31] disabled:opacity-45">
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Positions tab ─────────────────────────────────────────────────────────────

function PositionsTab() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Position> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: positions = [], isLoading } = useQuery({ queryKey: ["positions"], queryFn: api.positions.list });

  const saveMutation = useMutation({
    mutationFn: (d: Partial<Position>) =>
      d.id ? api.positions.update(d.id, d) : api.positions.create(d as Omit<Position, "id">),
    onSuccess: () => {
      toast.success(editing?.id ? "Đã cập nhật!" : "Đã tạo mới!");
      qc.invalidateQueries({ queryKey: ["positions"] });
      setEditing(null); setShowForm(false);
    },
    onError: () => toast.error("Thao tác thất bại."),
  });

  const deleteMutation = useMutation({
    mutationFn: api.positions.remove,
    onSuccess: () => { toast.success("Đã xóa."); qc.invalidateQueries({ queryKey: ["positions"] }); },
    onError: () => toast.error("Không thể xóa."),
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => { setEditing({ code: "", name: "", active: true }); setShowForm(true); }}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#166534] px-4 text-sm font-semibold text-white hover:bg-[#0D5C31]">
          <Plus className="h-4 w-4" /> Thêm chức vụ
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-[#166534]" /></div>
      ) : (
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                <th className="px-5 py-3 text-left">Mã</th>
                <th className="px-5 py-3 text-left">Tên chức vụ</th>
                <th className="px-5 py-3 text-left">Phạm vi</th>
                <th className="px-5 py-3 text-left">Mô tả</th>
                <th className="px-5 py-3 text-left">Trạng thái</th>
                <th className="px-5 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-[#6C8572]">Chưa có dữ liệu</td></tr>
              )}
              {positions.map((item, i) => (
                <tr key={item.id} className={`border-b border-[#B3CCBC] hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}>
                  <td className="px-5 py-3 font-mono text-xs text-[#3E5448]">{item.code}</td>
                  <td className="px-5 py-3 font-medium text-[#0A1F12]">{item.name}</td>
                  <td className="px-5 py-3 text-[#6C8572]">{item.scopeLevel ?? "—"}</td>
                  <td className="px-5 py-3 text-[#6C8572] max-w-[200px] truncate">{item.description ?? "—"}</td>
                  <td className="px-5 py-3"><StatusBadge active={item.active} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing({ ...item }); setShowForm(true); }}
                        className="flex h-7 items-center gap-1 rounded-lg border border-[#B3CCBC] bg-white px-2.5 text-xs font-medium text-[#3E5448] hover:bg-[#EEF7F2]">
                        <Pencil className="h-3 w-3" /> Sửa
                      </button>
                      <button onClick={() => { if (confirm("Xóa chức vụ này?")) deleteMutation.mutate(item.id); }}
                        className="flex h-7 items-center gap-1 rounded-lg border border-[#FEE2E2] bg-white px-2.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2]">
                        <Trash2 className="h-3 w-3" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#0A1F12]">{editing.id ? "Sửa chức vụ" : "Thêm chức vụ"}</h3>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-[#6C8572] hover:bg-[#EEF7F2]"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={LABEL_CLS}>Mã *</label>
                <input className={FIELD_CLS} value={editing.code ?? ""} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></div>
              <div><label className={LABEL_CLS}>Tên chức vụ *</label>
                <input className={FIELD_CLS} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className={LABEL_CLS}>Phạm vi</label>
                <input className={FIELD_CLS} value={editing.scopeLevel ?? ""} onChange={(e) => setEditing({ ...editing, scopeLevel: e.target.value })} placeholder="INSTITUTION, UNIT..." /></div>
              <div><label className={LABEL_CLS}>Mô tả</label>
                <input className={FIELD_CLS} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active-pos" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-[#166534]" />
                <label htmlFor="active-pos" className="text-sm text-[#3E5448]">Đang hoạt động</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] hover:bg-[#EEF7F2]">Hủy</button>
              <button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending || !editing.code || !editing.name}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white hover:bg-[#0D5C31] disabled:opacity-45">
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "institutions", label: "Cơ sở đào tạo", icon: Building2 },
  { key: "units", label: "Khoa / Bộ môn", icon: Layers },
  { key: "positions", label: "Chức vụ", icon: Briefcase },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminAcademicPage() {
  const [tab, setTab] = useState<TabKey>("institutions");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1 border-b border-[#B3CCBC] pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Quản trị viên</p>
        <h1 className="text-2xl font-bold text-[#0A1F12]">Quản lý học thuật</h1>
        <p className="text-sm text-[#6C8572]">Quản lý cơ sở đào tạo, khoa/bộ môn và chức vụ</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-[#B3CCBC] bg-[#EEF7F2] p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === key
                ? "bg-white text-[#166534] shadow-sm"
                : "text-[#6C8572] hover:text-[#0A1F12]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "institutions" && <InstitutionsTab />}
      {tab === "units" && <UnitsTab />}
      {tab === "positions" && <PositionsTab />}
    </div>
  );
}
