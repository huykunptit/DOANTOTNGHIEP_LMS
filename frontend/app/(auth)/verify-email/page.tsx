"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, GraduationCap, Loader2, Mail, XCircle } from "lucide-react";
import { verifyEmail, resendVerificationEmail } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

type Status = "idle" | "verifying" | "success" | "error";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const [resendBusy, setResendBusy] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setStatus("verifying");
    verifyEmail({ token })
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Không thể xác minh email");
      });
  }, [token]);

  const handleResend = async () => {
    if (!isLoggedIn) {
      setResendMessage("Vui lòng đăng nhập trước để gửi lại email xác minh.");
      return;
    }
    setResendBusy(true);
    setResendMessage(null);
    try {
      const res = await resendVerificationEmail();
      setResendMessage(res.message);
    } catch (err) {
      setResendMessage(err instanceof Error ? err.message : "Không thể gửi lại email");
    } finally {
      setResendBusy(false);
    }
  };

  const iconEl =
    status === "success" ? (
      <CheckCircle2 className="h-5 w-5 text-[#166534]" />
    ) : status === "error" ? (
      <XCircle className="h-5 w-5 text-[#DC2626]" />
    ) : (
      <Mail className="h-5 w-5 text-[#166534]" />
    );

  const title =
    status === "success"
      ? "Email đã xác minh"
      : status === "error"
      ? "Xác minh thất bại"
      : "Kiểm tra hộp thư";

  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-8 shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F2]">
          {iconEl}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">
            ERIPT LMS
          </p>
          <h2 className="text-xl font-bold text-[#0A1F12]">{title}</h2>
        </div>
      </div>

      {/* Status messages */}
      {status === "verifying" && (
        <p className="mt-6 flex items-center gap-2 text-sm text-[#6C8572]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang xác minh email của bạn…
        </p>
      )}

      {status === "success" && (
        <p className="mt-6 rounded-lg border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-3 text-sm text-[#166534]">
          {message}
        </p>
      )}

      {status === "error" && (
        <p className="mt-6 rounded-lg border border-[#FEE2E2] bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
          {message}
        </p>
      )}

      {status === "idle" && (
        <p className="mt-6 text-sm leading-6 text-[#6C8572]">
          Chúng tôi đã gửi liên kết xác minh đến địa chỉ email của bạn. Nhấn vào liên kết để kích
          hoạt tài khoản.
        </p>
      )}

      {/* Resend section */}
      <div className="mt-6 rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] p-5">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-[#166534]" />
          <span className="text-sm font-medium text-[#0A1F12]">Không nhận được email?</span>
        </div>
        <p className="mt-2 text-sm text-[#6C8572]">
          Kiểm tra thư mục spam hoặc yêu cầu gửi lại sau một lúc.
        </p>
        {resendMessage && (
          <p className="mt-3 text-xs text-[#6C8572]">{resendMessage}</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleResend}
          disabled={resendBusy}
          className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
        >
          {resendBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Gửi lại email xác minh"
          )}
        </button>
        <Link
          href="/login"
          className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#B3CCBC] text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
