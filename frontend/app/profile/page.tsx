"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, ShieldCheck, User2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, updateProfile, updateProfilePending, changePassword, changePasswordPending } =
    useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    gender: "",
    dateOfBirth: "",
    hometown: "",
    permanentAddress: "",
  });
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name ?? "" }));
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await updateProfile(form);
      setProfileMsg({ ok: true, text: "Cập nhật hồ sơ thành công" });
    } catch (err) {
      setProfileMsg({ ok: false, text: err instanceof Error ? err.message : "Cập nhật thất bại" });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.newPassword !== pwd.confirm) {
      setPwdMsg({ ok: false, text: "Mật khẩu xác nhận không khớp" });
      return;
    }
    try {
      await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      setPwdMsg({ ok: true, text: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." });
    } catch (err) {
      setPwdMsg({ ok: false, text: err instanceof Error ? err.message : "Đổi mật khẩu thất bại" });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3 px-6 py-10 text-[#6C8572]">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Đang tải hồ sơ…</span>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <header className="flex items-center gap-5 border-b border-[#B3CCBC] pb-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0D5C31] text-2xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F12]">Hồ sơ cá nhân</h1>
          <p className="text-sm text-[#6C8572]">{user.email}</p>
        </div>
      </header>

      {/* Profile info */}
      <section className="rounded-2xl border border-[#B3CCBC] bg-white">
        <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
          <User2 className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-semibold text-[#0A1F12]">Thông tin cá nhân</h2>
        </div>
        <form className="p-6 grid gap-5 sm:grid-cols-2" onSubmit={handleProfileSubmit}>
          <Field label="Tên" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field
            label="Số điện thoại"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field
            label="Giới tính"
            value={form.gender}
            onChange={(v) => setForm({ ...form, gender: v })}
          />
          <Field
            label="Ngày sinh"
            type="date"
            value={form.dateOfBirth}
            onChange={(v) => setForm({ ...form, dateOfBirth: v })}
          />
          <Field
            label="Quê quán"
            value={form.hometown}
            onChange={(v) => setForm({ ...form, hometown: v })}
          />
          <Field
            label="Địa chỉ thường trú"
            value={form.permanentAddress}
            onChange={(v) => setForm({ ...form, permanentAddress: v })}
          />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
              Tiểu sử
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-[#6C8572] bg-white px-3 py-2.5 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition resize-none"
            />
          </div>
          {profileMsg && (
            <p
              className={`sm:col-span-2 rounded-lg border px-4 py-3 text-sm ${
                profileMsg.ok
                  ? "border-[#DCFCE7] bg-[#DCFCE7] text-[#166534]"
                  : "border-[#FEE2E2] bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {profileMsg.text}
            </p>
          )}
          <div className="sm:col-span-2 flex justify-end gap-3">
            <button
              type="submit"
              disabled={updateProfilePending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {updateProfilePending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-[#B3CCBC] bg-white">
        <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
          <ShieldCheck className="h-5 w-5 text-[#166534]" />
          <h2 className="text-base font-semibold text-[#0A1F12]">Đổi mật khẩu</h2>
        </div>
        <form className="p-6 grid gap-5 sm:grid-cols-2" onSubmit={handlePasswordSubmit}>
          <Field
            label="Mật khẩu hiện tại"
            type="password"
            value={pwd.currentPassword}
            onChange={(v) => setPwd({ ...pwd, currentPassword: v })}
          />
          <div className="hidden sm:block" />
          <Field
            label="Mật khẩu mới"
            type="password"
            value={pwd.newPassword}
            onChange={(v) => setPwd({ ...pwd, newPassword: v })}
          />
          <Field
            label="Xác nhận mật khẩu"
            type="password"
            value={pwd.confirm}
            onChange={(v) => setPwd({ ...pwd, confirm: v })}
          />
          {pwdMsg && (
            <p
              className={`sm:col-span-2 rounded-lg border px-4 py-3 text-sm ${
                pwdMsg.ok
                  ? "border-[#DCFCE7] bg-[#DCFCE7] text-[#166534]"
                  : "border-[#FEE2E2] bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {pwdMsg.text}
            </p>
          )}
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={changePasswordPending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {changePasswordPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
      />
    </div>
  );
}
