"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
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
      setError(err instanceof Error ? err.message : "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-200/90">Recovery</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Reset your password</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Enter your email address and we’ll send a reset link.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="you@example.com" />
        </label>

        {message && <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}
        {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

        <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Sending..." : "Send reset link"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-400">
        Remembered your password? <Link href="/login" className="text-blue-200 transition hover:text-blue-100">Back to sign in</Link>
      </p>
    </div>
  );
}
