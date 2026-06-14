"use client";

import { useQuery } from "@tanstack/react-query";
import { getCourse, getCourseGradebook } from "@/lib/api/course.api";
import { useParams } from "next/navigation";
import {
  BarChart2, CheckCircle2, Clock3, Loader2, Trophy, XCircle,
} from "lucide-react";
import Link from "next/link";

export default function GradebookPage() {
  const params = useParams();
  const courseId = params.id as string;

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const { data: gradebook, isLoading } = useQuery({
    queryKey: ["gradebook", courseId],
    queryFn: () => getCourseGradebook(courseId),
  });

  const courseTitle = (course as any)?.title ?? (course as any)?.name ?? "Khóa học";

  const items: any[] = gradebook?.items ?? gradebook ?? [];
  const summary = gradebook?.summary ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/student/courses/${courseId}/learn`}
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-[#6C8572] transition hover:text-[#166534]"
          >
            ← Quay lại học bài
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1F12]">Bảng điểm</h1>
          <p className="mt-1 text-sm text-[#6C8572]">{courseTitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#B3CCBC] bg-white px-4 py-3">
          <BarChart2 className="h-5 w-5 text-[#166534]" />
          <span className="text-sm font-semibold text-[#0A1F12]">
            {summary?.overallScore != null ? `${summary.overallScore}%` : "—"}
          </span>
          <span className="text-xs text-[#6C8572]">điểm tổng</span>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6C8572]">Điểm tổng</span>
              <Trophy className="h-5 w-5 text-[#166534]" />
            </div>
            <div className="mt-3 text-3xl font-bold text-[#0A1F12]">
              {summary.overallScore ?? "—"}
              {summary.overallScore != null && <span className="ml-1 text-lg font-medium text-[#6C8572]">%</span>}
            </div>
          </div>
          <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6C8572]">Bài đã hoàn thành</span>
              <CheckCircle2 className="h-5 w-5 text-[#166534]" />
            </div>
            <div className="mt-3 text-3xl font-bold text-[#0A1F12]">
              {summary.completedItems ?? 0}
              <span className="ml-1 text-lg font-medium text-[#6C8572]">/ {summary.totalItems ?? 0}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[#B3CCBC] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6C8572]">Chờ chấm điểm</span>
              <Clock3 className="h-5 w-5 text-[#166534]" />
            </div>
            <div className="mt-3 text-3xl font-bold text-[#0A1F12]">
              {summary.pendingItems ?? 0}
            </div>
          </div>
        </div>
      )}

      {/* Grade items table */}
      <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
          <h2 className="text-base font-semibold text-[#0A1F12]">Chi tiết điểm</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <BarChart2 className="h-10 w-10 text-[#B3CCBC]" />
            <p className="mt-3 text-sm text-[#6C8572]">Chưa có dữ liệu điểm.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  <th className="px-6 py-3 text-left">Bài kiểm tra / Bài tập</th>
                  <th className="px-6 py-3 text-left">Loại</th>
                  <th className="px-6 py-3 text-left">Điểm</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Ngày nộp</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr
                    key={item.id ?? i}
                    className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                  >
                    <td className="px-6 py-3 font-medium text-[#0A1F12]">
                      {item.title ?? item.assignmentTitle ?? item.quizTitle ?? `Bài #${item.id}`}
                    </td>
                    <td className="px-6 py-3 text-[#6C8572]">
                      {item.type === "QUIZ"
                        ? "Quiz"
                        : item.type === "ASSIGNMENT"
                        ? "Bài tập"
                        : item.type ?? "—"}
                    </td>
                    <td className="px-6 py-3">
                      {item.score != null ? (
                        <span className={`font-semibold ${item.score >= (item.passScore ?? 50) ? "text-[#166534]" : "text-[#DC2626]"}`}>
                          {item.score}%
                        </span>
                      ) : (
                        <span className="text-[#6C8572]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <GradeStatusBadge status={item.status} score={item.score} passScore={item.passScore} />
                    </td>
                    <td className="px-6 py-3 text-[#6C8572]">
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString("vi-VN")
                        : item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
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

function GradeStatusBadge({ status, score, passScore }: { status?: string; score?: number; passScore?: number }) {
  if (status === "GRADED" || (score != null && passScore != null)) {
    const passed = score != null && score >= (passScore ?? 50);
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        passed ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#DC2626]"
      }`}>
        {passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        {passed ? "Đạt" : "Chưa đạt"}
      </span>
    );
  }
  if (status === "PENDING" || status === "SUBMITTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#B45309]">
        <Clock3 className="h-3 w-3" />
        Chờ chấm
      </span>
    );
  }
  return (
    <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#64748B]">
      Chưa nộp
    </span>
  );
}
