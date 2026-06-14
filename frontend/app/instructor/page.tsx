"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight, BookOpen, CheckCircle2, Loader2, Users,
} from "lucide-react";
import Link from "next/link";
import { getInstructorStats, getInstructorCourses } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function InstructorDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["instructor-stats"],
    queryFn: getInstructorStats,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["instructor-courses"],
    queryFn: getInstructorCourses,
  });

  const courseList = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Giảng viên</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F12]">
            Xin chào, {user?.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#6C8572]">
            Quản lý khóa học, chấm bài và theo dõi tiến độ học viên.
          </p>
        </div>
        <Link
          href="/instructor/courses"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
        >
          Quản lý khóa học <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        {statsLoading ? (
          <div className="col-span-3 flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#6C8572]" />
          </div>
        ) : (
          <>
            <StatCard
              label="Khóa học"
              value={stats?.totalCourses ?? 0}
              sub="đang giảng dạy"
              icon={<BookOpen className="h-5 w-5 text-[#166534]" />}
            />
            <StatCard
              label="Học viên"
              value={stats?.totalStudents ?? 0}
              sub="đã đăng ký"
              icon={<Users className="h-5 w-5 text-[#166534]" />}
            />
            <StatCard
              label="Bài nộp chờ chấm"
              value={stats?.pendingGrading ?? 0}
              sub="cần xử lý"
              highlight={!!stats?.pendingGrading}
              icon={<CheckCircle2 className="h-5 w-5 text-[#166534]" />}
            />
          </>
        )}
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Course list */}
        <div className="rounded-2xl border border-[#B3CCBC] bg-white">
          <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
            <BookOpen className="h-5 w-5 text-[#166534]" />
            <h2 className="text-lg font-semibold text-[#0A1F12]">Khóa học của tôi</h2>
          </div>

          <div className="p-6 space-y-3">
            {coursesLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-[#6C8572] mx-auto" />
              </div>
            )}

            {!coursesLoading && courseList.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
                <h3 className="mt-4 text-base font-semibold text-[#0A1F12]">Chưa có khóa học nào</h3>
                <p className="mt-2 max-w-xs text-sm text-[#6C8572]">
                  Tạo khóa học đầu tiên của bạn và bắt đầu giảng dạy.
                </p>
                <Link
                  href="/instructor/courses/new"
                  className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
                >
                  Tạo khóa học
                </Link>
              </div>
            )}

            {courseList.slice(0, 5).map((course) => (
              <Link
                key={course.id}
                href={`/instructor/courses/${course.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-[#B3CCBC] bg-white p-4 transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-[#0A1F12]">
                    {(course as any).title ?? (course as any).name ?? `Khóa học #${course.id}`}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#6C8572]">{(course as any).code ?? ""}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    course.active
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {course.active ? "Đang mở" : "Tạm dừng"}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#B3CCBC] bg-white">
            <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <CheckCircle2 className="h-5 w-5 text-[#166534]" />
              <h2 className="text-lg font-semibold text-[#0A1F12]">Thao tác nhanh</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Xem danh sách khóa học", href: "/instructor/courses" },
                { label: "Chấm bài nộp", href: "/instructor/courses" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-[#B3CCBC] px-4 py-3 text-sm font-medium text-[#0A1F12] transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-[#6C8572]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight = false,
  icon,
}: {
  label: string;
  value: number;
  sub: string;
  highlight?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6C8572]">{label}</span>
        {icon}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span
          className={`text-3xl font-bold ${
            highlight ? "text-[#B45309]" : "text-[#0A1F12]"
          }`}
        >
          {value}
        </span>
        <span className="text-sm text-[#6C8572]">{sub}</span>
      </div>
    </div>
  );
}
