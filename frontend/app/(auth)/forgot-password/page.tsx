"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await forgotPassword({ email });
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi email khôi phục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5 shadow-[0_4px_16px_rgba(13,92,49,0.08)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F2]">
          <GraduationCap className="h-5 w-5 text-[#166534]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">ERIPT LMS</p>
          <h2 className="text-xl font-bold text-[#0A1F12]">Khôi phục mật khẩu</h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#6C8572]">
        Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
          />
        </div>

        {message && (
          <p className="rounded-xl border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-3 text-sm text-[#166534]">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-[#FEE2E2] bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#166534] px-4 text-base font-semibold text-white transition hover:bg-[#0D5C31] active:bg-[#0a4424] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6C8572]">
        Nhớ mật khẩu rồi?{" "}
        <Link href="/login" className="font-semibold text-[#166534] transition hover:text-[#0D5C31]">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
