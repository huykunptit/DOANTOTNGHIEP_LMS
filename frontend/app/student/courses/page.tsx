"use client";

import { useQuery } from "@tanstack/react-query";
import { getEnrolledCourses } from "@/lib/api/course.api";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Loader2, PlayCircle, BarChart2 } from "lucide-react";
import Link from "next/link";

export default function MyCoursesPage() {
  const router = useRouter();

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["enrolled_courses"],
    queryFn: getEnrolledCourses,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F12]">Khóa học của tôi</h1>
          <p className="mt-1 text-sm text-[#6C8572]">
            {courses ? `${courses.length} khóa học đã đăng ký` : "Đang tải…"}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex h-10 items-center rounded-lg border border-[#2D6A4C] bg-[#EEF7F2] px-4 text-sm font-semibold text-[#166534] transition hover:bg-[#D5EADE]"
        >
          Khám phá thêm khóa học
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[#FEE2E2] bg-[#FEE2E2] p-5 text-sm text-[#DC2626]">
          Không thể tải danh sách khóa học. Vui lòng thử lại.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && (!courses || courses.length === 0) && (
        <div className="flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-16 text-center">
          <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
          <h3 className="mt-4 text-base font-semibold text-[#0A1F12]">
            Bạn chưa đăng ký khóa học nào
          </h3>
          <p className="mt-2 max-w-xs text-sm text-[#6C8572]">
            Khám phá danh mục khóa học và bắt đầu hành trình học tập của bạn.
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            Khám phá khóa học
          </Link>
        </div>
      )}

      {/* Course grid */}
      {!isLoading && courses && courses.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const title = (course as any).title ?? course.name ?? `Khóa học #${course.id}`;
            return (
              <div
                key={course.id}
                className="flex flex-col rounded-2xl border border-[#B3CCBC] bg-white transition hover:border-[#6C8572] hover:shadow-[0_4px_16px_rgba(13,92,49,0.08)]"
              >
                {/* Thumbnail */}
                <div className="flex h-32 items-center justify-center rounded-t-2xl bg-[#EEF7F2]">
                  <GraduationCap className="h-10 w-10 text-[#B3CCBC]" />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  {course.code && (
                    <span className="w-fit rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                      {course.code}
                    </span>
                  )}
                  <h3 className="font-semibold text-[#0A1F12] line-clamp-2">{title}</h3>
                  {course.description && (
                    <p className="flex-1 text-xs text-[#6C8572] line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => router.push(`/student/courses/${course.id}/learn`)}
                      className="flex flex-1 items-center justify-center gap-2 h-10 rounded-lg bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Tiếp tục học
                    </button>
                    <button
                      onClick={() => router.push(`/student/courses/${course.id}/gradebook`)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#B3CCBC] text-[#6C8572] transition hover:bg-[#EEF7F2] hover:text-[#166534]"
                      title="Xem bảng điểm"
                    >
                      <BarChart2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
