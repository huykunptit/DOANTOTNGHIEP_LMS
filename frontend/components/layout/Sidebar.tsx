"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, LayoutDashboard, Calendar, Settings, LogOut,
  Users, School, Plus, ShoppingBag, Shield, BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/courses", label: "Khóa học của tôi", icon: BookOpen },
  { href: "/student/schedule", label: "Lịch học", icon: Calendar },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

const instructorLinks = [
  { href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "Khóa học", icon: BookOpen },
  { href: "/instructor/courses/new", label: "Tạo khóa học", icon: Plus },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
  { href: "/admin/academic", label: "Học thuật", icon: School },
  { href: "/admin/rbac", label: "Phân quyền", icon: Shield },
  { href: "/courses", label: "Khóa học", icon: BookOpen },
  { href: "/profile", label: "Cài đặt", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const roles = user?.roles ?? [];
  const isAdmin = roles.some((r) => r === "ROLE_ADMIN");
  const isInstructor = roles.some((r) => r === "ROLE_INSTRUCTOR");

  const navLinks = isAdmin ? adminLinks : isInstructor ? instructorLinks : studentLinks;
  const roleLabel = isAdmin ? "QUẢN TRỊ VIÊN" : isInstructor ? "GIẢNG VIÊN" : "SINH VIÊN";

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="border-b border-white/15 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-base font-bold text-white">
            E
          </div>
          <div className="min-w-0">
            <span className="block text-base font-semibold tracking-wide text-white truncate">
              ERIPT LMS
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-white/45">
            {roleLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin" &&
                    link.href !== "/student" &&
                    link.href !== "/instructor" &&
                    pathname.startsWith(`${link.href}/`));

                return (
                  <SidebarMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#166534] text-white"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {/* Active left indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#52C47E]" />
                      )}
                      <link.icon className="h-5 w-5 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/15 p-4">
        <div className="mb-3 px-1">
          <p className="text-sm font-semibold text-white truncate">{user?.name || "Người dùng"}</p>
          <p className="text-xs text-white/65 truncate">{user?.email || "user@eript.edu.vn"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
