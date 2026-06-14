"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen, CheckCircle2, Clock3, GraduationCap,
  Loader2, PlayCircle, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getStudentStats, getEnrolledCourses } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
  });

  const { data: enrolledPage, isLoading: coursesLoading } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: getEnrolledCourses,
  });

  const enrolledCourses = Array.isArray(enrolledPage) ? enrolledPage : [];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-[#6C8572]">Xin chào, {user?.name ?? "bạn"}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0A1F12]">
            Tiếp tục hành trình học tập
          </h1>
        </div>
        <Link
          href="/student/courses"
          className="inline-flex h-10 items-center rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
        >
          Xem khóa học
        </Link>
      </header>

      {/* KPI stat cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Khóa học đang học"
          value={stats?.enrolledCourses ?? 0}
          loading={statsLoading}
          icon={<BookOpen className="h-5 w-5 text-[#166534]" />}
        />
        <StatCard
          label="Bài học đã hoàn thành"
          value={stats?.completedLessons ?? 0}
          loading={statsLoading}
          icon={<CheckCircle2 className="h-5 w-5 text-[#166534]" />}
        />
        <StatCard
          label="Bài học đang học"
          value={stats?.inProgressLessons ?? 0}
          loading={statsLoading}
          icon={<Clock3 className="h-5 w-5 text-[#166534]" />}
        />
      </section>

      {/* Main content */}
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Enrolled courses panel */}
        <div className="rounded-2xl border border-[#B3CCBC] bg-white">
          <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
            <div>
              <h2 className="text-lg font-semibold text-[#0A1F12]">Khóa học đang học</h2>
              <p className="mt-0.5 text-sm text-[#6C8572]">Tiếp tục từ bài học cuối.</p>
            </div>
            <PlayCircle className="h-5 w-5 text-[#166534]" />
          </div>

          <div className="p-6 space-y-3">
            {coursesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#6C8572]" />
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
                <h3 className="mt-4 text-base font-semibold text-[#0A1F12]">Chưa đăng ký khóa học nào</h3>
                <p className="mt-2 max-w-xs text-sm text-[#6C8572]">
                  Khám phá danh mục khóa học và bắt đầu hành trình của bạn.
                </p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
                >
                  Khám phá khóa học
                </Link>
              </div>
            ) : (
              enrolledCourses.slice(0, 4).map((course) => (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}/learn`}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[#B3CCBC] bg-white p-4 transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#0A1F12]">
                      {(course as any).title ?? (course as any).name ?? `Khóa học #${course.id}`}
                    </h3>
                    <p className="mt-0.5 text-sm text-[#6C8572]">{(course as any).code ?? ""}</p>
                  </div>
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[#166534]" />
                </Link>
              ))
            )}

            {enrolledCourses.length > 4 && (
              <Link
                href="/student/courses"
                className="mt-2 flex items-center gap-1 text-sm font-medium text-[#166534] transition hover:text-[#0D5C31]"
              >
                Xem tất cả {enrolledCourses.length} khóa học →
              </Link>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#B3CCBC] bg-white">
            <div className="flex items-center gap-3 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <Sparkles className="h-5 w-5 text-[#166534]" />
              <h2 className="text-lg font-semibold text-[#0A1F12]">Khám phá</h2>
            </div>
            <div className="p-5 space-y-3">
              <Link
                href="/courses"
                className="flex items-center gap-3 rounded-xl border border-[#B3CCBC] px-4 py-3 text-sm font-medium text-[#0A1F12] transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
              >
                <BookOpen className="h-4 w-4 text-[#166534]" />
                Tìm khóa học mới
              </Link>
              <Link
                href="/student/courses"
                className="flex items-center gap-3 rounded-xl border border-[#B3CCBC] px-4 py-3 text-sm font-medium text-[#0A1F12] transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
              >
                <PlayCircle className="h-4 w-4 text-[#166534]" />
                Tất cả khóa học của tôi
              </Link>
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
  loading,
  icon,
}: {
  label: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#6C8572]">{label}</span>
        {icon}
      </div>
      <div className="mt-4 text-3xl font-bold text-[#0A1F12]">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-[#6C8572]" />
        ) : (
          value
        )}
      </div>
    </div>
  );
}
