"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  BookOpen, CheckCircle2, GraduationCap, Loader2, PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getCourse, getCourseContent, enrollCourse, getEnrolledCourses, checkout } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });

  const { data: content } = useQuery({
    queryKey: ["course-content", id],
    queryFn: () => getCourseContent(id),
  });

  const { data: enrolled } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: getEnrolledCourses,
    enabled: isLoggedIn,
  });

  const isEnrolled = (Array.isArray(enrolled) ? enrolled : []).some(
    (c) => c.id === Number(id)
  );

  const enrollMutation = useMutation({
    mutationFn: () => enrollCourse(id),
    onSuccess: () => {
      toast.success("Đăng ký thành công!");
      qc.invalidateQueries({ queryKey: ["enrolled-courses"] });
      qc.invalidateQueries({ queryKey: ["student-stats"] });
      router.push(`/student/courses/${id}/learn`);
    },
    onError: (err: Error) => {
      if (err.message?.toLowerCase().includes("already")) {
        router.push(`/student/courses/${id}/learn`);
      } else {
        toast.error(err.message || "Đăng ký thất bại");
      }
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () => checkout(Number(id)),
    onSuccess: (res) => {
      if (res.status === "FREE") {
        toast.success("Đăng ký thành công!");
        qc.invalidateQueries({ queryKey: ["enrolled-courses"] });
        router.push(`/student/courses/${id}/learn`);
      } else if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCTA = () => {
    if (!isLoggedIn) { router.push(`/login?redirect=/courses/${id}`); return; }
    if (isEnrolled) { router.push(`/student/courses/${id}/learn`); return; }
    const price = (course as any)?.price ?? 0;
    if (price > 0) checkoutMutation.mutate();
    else enrollMutation.mutate();
  };

  const pending = enrollMutation.isPending || checkoutMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7FAF8]">
        <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
        <p className="text-[#6C8572]">Không tìm thấy khóa học.</p>
      </div>
    );
  }

  const price = (course as any).price ?? 0;
  const title = (course as any).title ?? (course as any).name ?? `Khóa học #${course.id}`;
  const totalLessons =
    content?.reduce((s, sec) => s + (sec.lessons?.length ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      {/* Hero */}
      <div className="border-b border-[#B3CCBC] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Course info */}
            <div>
              <span className="rounded-full bg-[#EEF7F2] px-3 py-1 text-xs font-semibold text-[#166534]">
                {(course as any).code ?? "IT"}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0A1F12] md:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#3E5448]">
                {(course as any).description ?? "Khóa học thuộc chương trình đào tạo."}
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#6C8572]">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#166534]" />
                  {totalLessons} bài học
                </div>
                {(course as any).creditValue && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#166534]" />
                    {(course as any).creditValue} tín chỉ
                  </div>
                )}
                {(course as any).courseMode && (
                  <div className="flex items-center gap-1.5">
                    <PlayCircle className="h-4 w-4 text-[#166534]" />
                    {(course as any).courseMode === "ONLINE"
                      ? "Trực tuyến"
                      : (course as any).courseMode === "OFFLINE"
                      ? "Trực tiếp"
                      : "Kết hợp"}
                  </div>
                )}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-[0_4px_16px_rgba(13,92,49,0.08)] lg:self-start">
              <div className="text-3xl font-bold text-[#0A1F12]">
                {price > 0 ? `${price.toLocaleString("vi-VN")} ₫` : "Miễn phí"}
              </div>

              {isEnrolled && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#DCFCE7] px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" />
                  <span className="text-xs font-medium text-[#166534]">
                    Bạn đã đăng ký khóa học này
                  </span>
                </div>
              )}

              <button
                onClick={handleCTA}
                disabled={pending}
                className="mt-4 h-11 w-full rounded-lg bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {pending ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : isEnrolled ? (
                  "Tiếp tục học"
                ) : price > 0 ? (
                  "Mua khóa học"
                ) : (
                  "Đăng ký miễn phí"
                )}
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-xs text-[#6C8572]">
                  Cần đăng nhập để đăng ký
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <h2 className="text-xl font-bold text-[#0A1F12]">Nội dung khóa học</h2>

        {content && content.length > 0 ? (
          <div className="mt-5 space-y-4">
            {content.map((section) => (
              <div
                key={section.id}
                className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden"
              >
                {/* Section header */}
                <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-5 py-3">
                  <h3 className="font-semibold text-[#0A1F12]">{section.title}</h3>
                  {section.lessons && (
                    <p className="mt-0.5 text-xs text-[#6C8572]">
                      {section.lessons.length} bài học
                    </p>
                  )}
                </div>

                {/* Lessons list */}
                <div className="divide-y divide-[#B3CCBC]">
                  {section.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <PlayCircle className="h-4 w-4 shrink-0 text-[#166534]" />
                      <span className="flex-1 text-sm text-[#3E5448]">{lesson.title}</span>
                      <div className="flex items-center gap-2">
                        {lesson.duration ? (
                          <span className="text-xs text-[#6C8572]">{lesson.duration} phút</span>
                        ) : null}
                        {lesson.preview && (
                          <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#1D4ED8]">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-14 text-center">
            <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
            <h3 className="mt-4 text-base font-semibold text-[#0A1F12]">
              Nội dung đang được cập nhật
            </h3>
            <p className="mt-2 max-w-xs text-sm text-[#6C8572]">
              Vui lòng quay lại sau để xem nội dung khóa học.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
