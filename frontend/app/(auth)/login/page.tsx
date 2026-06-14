"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { login, getMe, type AuthResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

const GOOGLE_OAUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080"}/oauth2/authorization/google`;

function GoogleButton({ disabled }: { disabled?: boolean }) {
  return (
    <a
      href={disabled ? undefined : GOOGLE_OAUTH_URL}
      aria-disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#B3CCBC] bg-white text-sm font-semibold text-[#0A1F12] transition hover:bg-[#EEF7F2] active:bg-[#D5EADE] aria-disabled:cursor-not-allowed aria-disabled:opacity-45"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0D5C31] text-[10px] font-bold text-white">
        G
      </span>
      Tiếp tục với Google
    </a>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await login({ email, password });
      await syncAuth(auth, setAuth);
      router.push("/student");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5 shadow-[0_4px_16px_rgba(13,92,49,0.08)] sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F2]">
          <GraduationCap className="h-5 w-5 text-[#166534]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">ERIPT LMS</p>
          <h2 className="text-xl font-bold text-[#0A1F12]">Đăng nhập</h2>
        </div>
      </div>

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]"
          >
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
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#3E5448]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#6C8572] accent-[#166534]"
            />
            Ghi nhớ đăng nhập
          </label>
          <Link
            href="/forgot-password"
            className="min-h-[44px] content-center text-sm font-medium text-[#166534] transition hover:text-[#0D5C31]"
          >
            Quên mật khẩu?
          </Link>
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
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="relative py-2 text-center">
          <span className="relative z-10 bg-white px-3 text-xs font-medium uppercase tracking-[0.05em] text-[#6C8572]">
            hoặc tiếp tục với
          </span>
          <div className="absolute left-0 top-1/2 h-px w-full bg-[#B3CCBC]" />
        </div>

        <GoogleButton disabled={loading} />
      </form>

      <p className="mt-6 text-center text-sm text-[#6C8572]">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#166534] transition hover:text-[#0D5C31]"
        >
          Đăng ký ngay
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
  setAuth(
    { id: auth.userId, name: auth.name, email: auth.email, roles: auth.roles },
    auth.accessToken,
    auth.refreshToken
  );
  try {
    const me = await getMe();
    setAuth(
      { id: me.id, name: me.name, email: me.email, roles: me.roles },
      auth.accessToken,
      auth.refreshToken
    );
  } catch {
    // profile fetch failed — auth already set
  }
}
