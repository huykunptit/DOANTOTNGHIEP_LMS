import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-200/90">Recovery</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Set a new password</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Choose a strong password to secure your account.</p>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> New password</span>
          <input type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="Create a new password" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> Confirm password</span>
          <input type="password" className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="Repeat your password" />
        </label>

        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400">
          Update password
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-400">
        Need help? <Link href="/forgot-password" className="text-blue-200 transition hover:text-blue-100">Request another link</Link>
      </p>
    </div>
  );
}
