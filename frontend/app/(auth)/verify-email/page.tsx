import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
      <div className="flex items-center gap-3 text-blue-200/90">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em]">Verify email</p>
          <h2 className="text-xl font-semibold text-white">Check your inbox</h2>
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-400">
        We sent a verification link to your email address. Click the link to activate your account.
      </p>

      <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
        <div className="flex items-center gap-3 text-slate-200">
          <Mail className="h-5 w-5 text-blue-200" />
          <span>Didn’t receive the email?</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-400">Check spam or request a new verification email after a short wait.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400">
          Resend verification
        </button>
        <Link href="/login" className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm font-medium text-slate-200 transition hover:bg-white/5">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
