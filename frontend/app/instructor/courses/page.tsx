"use client";

import { useQuery } from "@tanstack/react-query";
import { getInstructorCourses } from "@/lib/api/course.api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2, Plus, Settings, Users } from "lucide-react";

export default function InstructorCoursesPage() {
  const router = useRouter();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["instructor_courses"],
    queryFn: getInstructorCourses,
  });

  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F12]">Khóa học của tôi</h1>
          <p className="mt-1 text-sm text-[#6C8572]">Quản lý nội dung và học viên.</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
        >
          <Plus className="h-4 w-4" />
          Tạo khóa học
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-16 text-center">
          <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
          <h3 className="mt-4 text-base font-semibold text-[#0A1F12]">Chưa có khóa học nào</h3>
          <p className="mt-2 max-w-xs text-sm text-[#6C8572]">
            Tạo khóa học đầu tiên để bắt đầu giảng dạy.
          </p>
          <Link
            href="/instructor/courses/new"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            <Plus className="h-4 w-4" />
            Tạo khóa học đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((course) => {
            const title =
              (course as any).title ?? (course as any).name ?? `Khóa học #${course.id}`;
            return (
              <div
                key={course.id}
                className="flex flex-col rounded-2xl border border-[#B3CCBC] bg-white p-5 transition hover:border-[#6C8572] hover:shadow-[0_4px_16px_rgba(13,92,49,0.08)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                    {(course as any).code ?? "—"}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.active
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {course.active ? "Đang mở" : "Tạm dừng"}
                  </span>
                </div>

                <h3 className="mt-3 font-semibold text-[#0A1F12] line-clamp-2">{title}</h3>
                <p className="mt-1 text-sm text-[#6C8572]">
                  {(course as any).price > 0
                    ? `${(course as any).price?.toLocaleString("vi-VN")} ₫`
                    : "Miễn phí"}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => router.push(`/instructor/courses/${course.id}`)}
                    className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-lg border border-[#B3CCBC] text-xs font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Quản lý
                  </button>
                  <button
                    onClick={() => router.push(`/instructor/courses/${course.id}/students`)}
                    className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-lg border border-[#B3CCBC] text-xs font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Học viên
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
