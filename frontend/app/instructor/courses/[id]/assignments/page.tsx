"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInstructorCourseAssignments, gradeSubmission } from "@/lib/api/course.api";
import { getCourse } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, CheckCircle2, Clock3, Loader2, Star,
} from "lucide-react";
import { toast } from "sonner";

export default function CourseAssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const courseId = params.id as string;

  const [grading, setGrading] = useState<{ subId: number; score: string; feedback: string } | null>(null);

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["course_assignments", courseId],
    queryFn: () => getInstructorCourseAssignments(courseId),
  });

  const gradeMutation = useMutation({
    mutationFn: ({ subId, score, feedback }: { subId: number; score: number; feedback: string }) =>
      gradeSubmission(subId, { score, feedback }),
    onSuccess: () => {
      toast.success("Đã chấm điểm thành công!");
      qc.invalidateQueries({ queryKey: ["course_assignments", courseId] });
      setGrading(null);
    },
    onError: () => toast.error("Chấm điểm thất bại."),
  });

  const courseTitle = (course as any)?.title ?? (course as any)?.name ?? `Khóa học #${courseId}`;

  const pending = (submissions as any[]).filter((s: any) => s.status !== "GRADED");
  const graded = (submissions as any[]).filter((s: any) => s.status === "GRADED");

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
          <h1 className="text-2xl font-bold text-[#0A1F12]">Bài tập nộp</h1>
          <p className="mt-1 text-sm text-[#6C8572]">{courseTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#FEF3C7] bg-[#FEF3C7] px-4 py-2 text-center">
            <p className="text-xs text-[#B45309]">Chờ chấm</p>
            <p className="text-xl font-bold text-[#B45309]">{pending.length}</p>
          </div>
          <div className="rounded-xl border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-2 text-center">
            <p className="text-xs text-[#166534]">Đã chấm</p>
            <p className="text-xl font-bold text-[#166534]">{graded.length}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#166534]" />
        </div>
      ) : (submissions as any[]).length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-14 text-center">
          <CheckCircle2 className="h-10 w-10 text-[#B3CCBC]" />
          <p className="mt-3 text-sm text-[#6C8572]">Chưa có bài nộp nào.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
          <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
            <h2 className="text-base font-semibold text-[#0A1F12]">Danh sách bài nộp</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#EEF7F2] text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Sinh viên</th>
                  <th className="px-6 py-3 text-left">Bài tập</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Điểm</th>
                  <th className="px-6 py-3 text-left">Nộp lúc</th>
                  <th className="px-6 py-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {(submissions as any[]).map((sub: any, i: number) => (
                  <tr
                    key={sub.id}
                    className={`border-b border-[#B3CCBC] transition hover:bg-[#E2F1E9] ${i % 2 === 0 ? "bg-[#F7FAF8]" : "bg-white"}`}
                  >
                    <td className="px-6 py-3 text-[#6C8572]">#{sub.id}</td>
                    <td className="px-6 py-3 font-medium text-[#0A1F12]">
                      {sub.studentName ?? sub.userName ?? `User #${sub.userId}`}
                    </td>
                    <td className="px-6 py-3 text-[#3E5448]">
                      {sub.assignment?.title ?? sub.assignmentTitle ?? `BT #${sub.assignment?.id ?? "—"}`}
                    </td>
                    <td className="px-6 py-3">
                      {sub.status === "GRADED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                          <CheckCircle2 className="h-3 w-3" /> Đã chấm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-medium text-[#B45309]">
                          <Clock3 className="h-3 w-3" /> Chờ chấm
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-semibold text-[#0A1F12]">
                      {sub.score != null ? `${sub.score}/100` : "—"}
                    </td>
                    <td className="px-6 py-3 text-[#6C8572]">
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setGrading({ subId: sub.id, score: sub.score?.toString() ?? "", feedback: sub.feedback ?? "" })}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#B3CCBC] bg-white px-3 text-xs font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] hover:text-[#166534]"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {sub.status === "GRADED" ? "Sửa điểm" : "Chấm điểm"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grading modal */}
      {grading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setGrading(null)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-[0_4px_24px_rgba(13,92,49,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#0A1F12]">Chấm điểm bài nộp #{grading.subId}</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  Điểm (0 – 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={grading.score}
                  onChange={(e) => setGrading({ ...grading, score: e.target.value })}
                  className="h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  Nhận xét (không bắt buộc)
                </label>
                <textarea
                  value={grading.feedback}
                  onChange={(e) => setGrading({ ...grading, feedback: e.target.value })}
                  rows={3}
                  placeholder="Nhận xét cho sinh viên..."
                  className="w-full rounded-xl border border-[#6C8572] bg-white px-4 py-3 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition resize-none"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setGrading(null)}
                className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
              >
                Hủy
              </button>
              <button
                onClick={() => gradeMutation.mutate({ subId: grading.subId, score: Number(grading.score), feedback: grading.feedback })}
                disabled={gradeMutation.isPending || grading.score === ""}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {gradeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Lưu điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
