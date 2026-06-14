"use client";

import { useAuthStore } from "@/stores/auth";
import { Search } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/notification-bell";

export function Header() {
  const user = useAuthStore((state) => state.user);

  const roleLabel = (() => {
    const roles = user?.roles ?? [];
    if (roles.some((r) => r === "ROLE_ADMIN")) return "Admin";
    if (roles.some((r) => r === "ROLE_INSTRUCTOR")) return "Giảng viên";
    return "Sinh viên";
  })();

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex flex-1 items-center justify-between">
      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6C8572]" />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          className="h-9 w-64 rounded-full border border-[#B3CCBC] bg-white pl-10 pr-4 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <NotificationBell />
        <div className="h-5 w-px bg-[#B3CCBC]" />
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-[#EEF7F2]"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#0A1F12]">{user?.name || "Người dùng"}</p>
            <p className="text-xs text-[#6C8572]">{roleLabel}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0D5C31] text-sm font-bold text-white">
            {initials}
          </div>
        </Link>
      </div>
    </div>
  );
}
