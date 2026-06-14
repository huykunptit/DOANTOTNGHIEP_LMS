"use client";

import { useQuery } from "@tanstack/react-query";
import { getInstructorCourseStudents, getCourse } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Users } from "lucide-react";

export default function CourseStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["course_students", courseId],
    queryFn: () => getInstructorCourseStudents(courseId),
  });

  const courseTitle = (course as any)?.title ?? (course as any)?.name ?? `Khóa học #${courseId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}`)}
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#6C8572] transition hover:text-[#166534]"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại khóa học
          </button>
          <h1 className="text-2xl font-bold text-[#0A1F12]">Danh sách học viên</h1>
          <p className="mt-1 text-sm text-[#6C8572]">{courseTitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#B3CCBC] bg-white px-4 py-3">
          <Users className="h-5 w-5 text-[#166534]" />
          <span className="text-sm font-bold text-[#0A1F12]">{(students as any[]).length}</span>
          <span className="text-xs text-[#6C8572]">học viên</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
          <h2 className="text-base font-semibold text-[#0A1F12]">Học viên đã đăng ký</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
          </div>
        ) : (students as any[]).length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <Users className="h-10 w-10 text-[#B3CCBC]" />
            <h3 className="mt-3 text-base font-semibold text-[#0A1F12]">Chưa có học viên nào</h3>
            <p className="mt-1 text-sm text-[#6C8572]">Học viên sẽ xuất hiện ở đây sau khi đăng ký khóa học.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Học viên</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Tiến độ</th>
                  <th className="px-6 py-3 text-left">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {(students as any[]).map((enrollment: any, i: number) => (
                  <tr
                    key={enrollment.id}
                    className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                  >
                    <td className="px-6 py-3 text-[#6C8572]">{i + 1}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D5C31] text-xs font-bold text-white">
                          {(enrollment.studentName ?? enrollment.userName ?? "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#0A1F12]">
                            {enrollment.studentName ?? enrollment.userName ?? `User #${enrollment.userId}`}
                          </p>
                          {enrollment.email && (
                            <p className="text-xs text-[#6C8572]">{enrollment.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        enrollment.status === "ACTIVE"
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}>
                        {enrollment.status === "ACTIVE" ? "Đang học" : enrollment.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#D5EADE]">
                          <div
                            className="h-1.5 rounded-full bg-[#166534]"
                            style={{ width: `${enrollment.progressPercent ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#166534]">
                          {enrollment.progressPercent ?? 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[#6C8572]">
                      {enrollment.enrolledAt
                        ? new Date(enrollment.enrolledAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
