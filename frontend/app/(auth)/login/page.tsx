"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, GraduationCap, Lock, Mail } from "lucide-react";
import { login, getMe, type AuthResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

function GoogleButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold text-white">
        G
      </span>
      Login with Google
    </button>
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
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3 text-blue-200/90">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em]">Sign in</p>
          <h2 className="text-xl font-semibold text-white">Welcome back</h2>
        </div>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-blue-400" placeholder="you@example.com" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="••••••••" />
        </label>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-950/60 text-blue-500" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-blue-200 transition hover:text-blue-100">Forgot password?</Link>
        </div>

        {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="relative py-2 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="relative z-10 bg-transparent px-3">or continue with</span>
          <div className="absolute left-0 top-1/2 h-px w-full bg-white/10" />
        </div>

        <GoogleButton disabled={loading} />
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Don’t have an account? <Link href="/register" className="text-blue-200 transition hover:text-blue-100">Create one</Link>
      </p>
    </div>
  );
}

async function syncAuth(auth: AuthResponse, setAuth: (user: { id: number; name: string; email: string; roles: string[] }, accessToken: string, refreshToken: string) => void) {
  const me = await getMe(auth.userId);
  setAuth(
    {
      id: me.id,
      name: me.name,
      email: me.email,
      roles: me.roles,
    },
    auth.accessToken,
    auth.refreshToken
  );
}
