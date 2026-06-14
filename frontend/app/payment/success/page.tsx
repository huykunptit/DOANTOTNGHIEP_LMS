"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  const orderCode = searchParams.get("orderCode");
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (countdown <= 0) {
      router.push(courseId ? `/student/courses/${courseId}/learn` : "/student/courses");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, courseId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FAF8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-10 text-center shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
            <CheckCircle2 className="h-10 w-10 text-[#166534]" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#0A1F12]">Thanh toán thành công!</h1>
        <p className="mt-3 text-sm text-[#6C8572]">
          Bạn đã đăng ký khóa học thành công. Hãy bắt đầu hành trình học tập ngay.
        </p>

        {orderCode && (
          <div className="mt-5 rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] px-4 py-3 text-sm">
            <span className="text-[#6C8572]">Mã đơn hàng: </span>
            <span className="font-semibold text-[#0A1F12]">#{orderCode}</span>
          </div>
        )}

        <p className="mt-5 text-sm text-[#6C8572]">
          Tự động chuyển hướng sau{" "}
          <span className="font-bold text-[#166534]">{countdown}s</span>…
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {courseId ? (
            <Link
              href={`/student/courses/${courseId}/learn`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
            >
              <BookOpen className="h-4 w-4" />
              Vào học ngay
            </Link>
          ) : (
            <Link
              href="/student/courses"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
            >
              <BookOpen className="h-4 w-4" />
              Xem khóa học của tôi
            </Link>
          )}
          <Link
            href="/courses"
            className="flex h-12 items-center justify-center rounded-xl border border-[#B3CCBC] text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
          >
            Khám phá thêm khóa học
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
          <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
        </div>
      }
    >
      <PaymentSuccessInner />
    </Suspense>
  );
}
