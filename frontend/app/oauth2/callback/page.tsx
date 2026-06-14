"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { getMe } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

function OAuth2CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const refresh = params.get("refresh");
    const err = params.get("error");

    if (err) {
      setError(
        err === "account_disabled"
          ? "Tài khoản đã bị vô hiệu hoá."
          : "Đăng nhập Google thất bại."
      );
      return;
    }

    if (!token || !refresh) {
      setError("Không tìm thấy token. Vui lòng thử lại.");
      return;
    }

    (async () => {
      try {
        const me = await getMe();
        setAuth(
          { id: me.id, name: me.name, email: me.email, roles: me.roles, userType: me.userType },
          token,
          refresh
        );
        const home = me.roles.includes("ROLE_ADMIN")
          ? "/admin"
          : me.roles.includes("ROLE_INSTRUCTOR")
          ? "/instructor"
          : "/student";
        router.replace(home);
      } catch {
        setError("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }
    })();
  }, [params, setAuth, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
        <div className="w-full max-w-sm rounded-2xl border border-[#B3CCBC] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2]">
              <XCircle className="h-6 w-6 text-[#DC2626]" />
            </div>
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#0A1F12]">Đăng nhập thất bại</h2>
          <p className="mt-2 text-sm text-[#6C8572]">{error}</p>
          <a
            href="/login"
            className="mt-6 block h-10 w-full rounded-lg bg-[#166534] text-center text-sm font-semibold leading-10 text-white transition hover:bg-[#0D5C31]"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
        <span className="text-sm text-[#6C8572]">Đang xử lý đăng nhập...</span>
      </div>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
          <Loader2 className="h-8 w-8 animate-spin text-[#166634]" />
        </div>
      }
    >
      <OAuth2CallbackInner />
    </Suspense>
  );
}
