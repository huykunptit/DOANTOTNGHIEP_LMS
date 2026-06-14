"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";

function PaymentCancelInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("courseId");
  const orderCode = searchParams.get("orderCode");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FAF8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-10 text-center shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
        {/* Cancel icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEE2E2]">
            <XCircle className="h-10 w-10 text-[#DC2626]" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#0A1F12]">Thanh toán bị hủy</h1>
        <p className="mt-3 text-sm text-[#6C8572]">
          Bạn đã hủy quá trình thanh toán. Không có khoản phí nào bị trừ.
        </p>

        {orderCode && (
          <div className="mt-5 rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] px-4 py-3 text-sm">
            <span className="text-[#6C8572]">Mã đơn: </span>
            <span className="font-semibold text-[#0A1F12]">#{orderCode}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {courseId && (
            <Link
              href={`/courses/${courseId}`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
            >
              <RefreshCcw className="h-4 w-4" />
              Thử lại thanh toán
            </Link>
          )}
          <Link
            href="/courses"
            className="flex h-12 items-center justify-center rounded-xl border border-[#B3CCBC] text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
          >
            Quay lại danh sách khóa học
          </Link>
          <Link
            href="/student"
            className="text-sm text-[#6C8572] transition hover:text-[#0A1F12]"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
          <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
        </div>
      }
    >
      <PaymentCancelInner />
    </Suspense>
  );
}
