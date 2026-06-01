"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CircleUserRound, Mail, Lock, School } from "lucide-react";
import { register, type AuthResponse } from "@/lib/api";
import { useAuthStore, type User } from "@/stores/auth";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await register({ name, email, password });
      await syncAuth(auth, setAuth, role);
      router.push(resolveDashboard(role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3 text-blue-200/90">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15">
          <CircleUserRound className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em]">Create account</p>
          <h2 className="text-xl font-semibold text-white">Join ERIPT LMS</h2>
        </div>
      </div>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><School className="h-4 w-4" /> Full name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="Nguyen Van A" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="you@example.com" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="Create a strong password" />
        </label>

        <label className="block">
          <span className="mb-2 text-sm text-slate-300">I am a</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none focus:border-blue-400">
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </label>

        {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account? <Link href="/login" className="text-blue-200 transition hover:text-blue-100">Sign in</Link>
      </p>
    </div>
  );
}

async function syncAuth(auth: AuthResponse, setAuth: (user: { id: number; name: string; email: string; roles: string[] }, accessToken: string, refreshToken: string) => void, role: string) {
  const user: User = {
    id: auth.userId,
    name: auth.name,
    email: auth.email,
    roles: normalizeRoles(auth.roles, role),
  };
  setAuth(user, auth.accessToken, auth.refreshToken);
}

function normalizeRoles(apiRoles: string[] | undefined, fallbackRole: string) {
  if (apiRoles?.length) return apiRoles;
  if (fallbackRole === "Instructor") return ["INSTRUCTOR"];
  if (fallbackRole === "Admin") return ["ADMIN"];
  return ["STUDENT"];
}

function resolveDashboard(role: string) {
  if (role === "Instructor") return "/instructor";
  if (role === "Admin") return "/admin";
  return "/student";
}
