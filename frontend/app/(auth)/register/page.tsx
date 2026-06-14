"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { register as registerApi, getMe, type AuthResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await registerApi({ name, email, password });
      await syncAuth(auth, setAuth);
      router.push("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo tài khoản. Vui lòng thử lại.");
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
          <h2 className="text-xl font-bold text-[#0A1F12]">Tạo tài khoản</h2>
        </div>
      </div>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
            Họ và tên
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
            Mật khẩu
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Tối thiểu 8 ký tự"
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
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#166534] px-4 text-base font-semibold text-white transition hover:bg-[#0D5C31] active:bg-[#0a4424] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#6C8572]">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-semibold text-[#166534] transition hover:text-[#0D5C31]">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

async function syncAuth(
  auth: AuthResponse,
  setAuth: (
    user: { id: number; name: string; email: string; roles: string[] },
    accessToken: string,
    refreshToken: string
  ) => void
) {
  const me = await getMe();
  setAuth(
    { id: me.id, name: me.name, email: me.email, roles: me.roles },
    auth.accessToken,
    auth.refreshToken
  );
}
