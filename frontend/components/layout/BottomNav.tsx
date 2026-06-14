"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import {
  BookOpen, LayoutDashboard, Calendar, Settings,
  Users, School, Plus, ShoppingBag,
} from "lucide-react";

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/courses", label: "Khóa học", icon: BookOpen },
  { href: "/student/schedule", label: "Lịch học", icon: Calendar },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

const instructorLinks = [
  { href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "Khóa học", icon: BookOpen },
  { href: "/instructor/courses/new", label: "Tạo mới", icon: Plus },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/admin/academic", label: "Học thuật", icon: School },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const roles = user?.roles ?? [];

  const isAdmin = roles.some((r) => r === "ROLE_ADMIN");
  const isInstructor = roles.some((r) => r === "ROLE_INSTRUCTOR");

  let navLinks = isAdmin ? adminLinks : isInstructor ? instructorLinks : studentLinks;
  if (navLinks.length > 5) navLinks = navLinks.slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#B3CCBC] bg-white">
      <div className="flex items-stretch" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" &&
              link.href !== "/student" &&
              link.href !== "/instructor" &&
              pathname.startsWith(`${link.href}/`));

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[56px] min-w-0 py-2 transition-colors ${
                isActive ? "text-[#166534]" : "text-[#6C8572]"
              }`}
            >
              {/* Active top indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#166534]" />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.75}
                aria-hidden="true"
              />
              <span
                className={`text-[11px] leading-none truncate max-w-full px-1 ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
