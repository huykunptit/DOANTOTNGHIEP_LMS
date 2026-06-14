"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, GraduationCap, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ token, newPassword: password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5 shadow-[0_4px_16px_rgba(13,92,49,0.08)] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F2]">
          {success
            ? <CheckCircle2 className="h-5 w-5 text-[#166534]" />
            : <GraduationCap className="h-5 w-5 text-[#166534]" />
          }
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">ERIPT LMS</p>
          <h2 className="text-xl font-bold text-[#0A1F12]">
            {success ? "Đặt lại thành công!" : "Đặt mật khẩu mới"}
          </h2>
        </div>
      </div>

      {success ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-xl border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-3 text-sm text-[#166534]">
            Mật khẩu của bạn đã được cập nhật. Đang chuyển về trang đăng nhập…
          </p>
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-xl bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            Đăng nhập ngay
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-[#6C8572]">Chọn mật khẩu mạnh để bảo vệ tài khoản.</p>

          {!token && (
            <p className="mt-4 rounded-xl border border-[#FEE2E2] bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </p>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="pw" className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                Mật khẩu mới
              </label>
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Tối thiểu 8 ký tự"
                className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-[#FEE2E2] bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="h-12 w-full rounded-xl bg-[#166534] text-base font-semibold text-white transition hover:bg-[#0D5C31] active:bg-[#0a4424] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {loading ? "Đang cập nhật…" : "Cập nhật mật khẩu"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6C8572]">
            Cần trợ giúp?{" "}
            <Link href="/forgot-password" className="font-semibold text-[#166534] transition hover:text-[#0D5C31]">
              Yêu cầu liên kết khác
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
