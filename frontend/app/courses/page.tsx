"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { getCourses, enrollCourse, getEnrolledCourses, checkout } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

export default function CourseCatalogPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const isLoggedIn = useAuthStore((s) => !!s.accessToken);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["courses-public", page, search],
    queryFn: () => getCourses(page, 12, search),
  });

  const { data: enrolled } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: getEnrolledCourses,
    enabled: isLoggedIn,
  });

  const enrolledIds = new Set((Array.isArray(enrolled) ? enrolled : []).map((c) => c.id));

  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => enrollCourse(courseId),
    onSuccess: (_, courseId) => {
      toast.success("Đăng ký thành công!");
      qc.invalidateQueries({ queryKey: ["enrolled-courses"] });
      qc.invalidateQueries({ queryKey: ["student-stats"] });
      router.push(`/student/courses/${courseId}/learn`);
    },
    onError: (err: Error) => {
      if (err.message?.toLowerCase().includes("already")) {
        toast.info("Bạn đã đăng ký khóa học này rồi.");
      } else {
        toast.error(err.message || "Đăng ký thất bại");
      }
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (courseId: number) => checkout(courseId),
    onSuccess: (res, courseId) => {
      if (res.status === "FREE") {
        toast.success("Đăng ký thành công!");
        qc.invalidateQueries({ queryKey: ["enrolled-courses"] });
        router.push(`/student/courses/${courseId}/learn`);
      } else if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAction = (courseId: number, price: number) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses`);
      return;
    }
    if (enrolledIds.has(courseId)) {
      router.push(`/student/courses/${courseId}/learn`);
      return;
    }
    if (price > 0) {
      checkoutMutation.mutate(courseId);
    } else {
      enrollMutation.mutate(courseId);
    }
  };

  const courses = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      {/* Page hero */}
      <div className="border-b border-[#B3CCBC] bg-white px-6 py-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">ERIPT LMS</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0A1F12]">Danh sách khóa học</h1>
        <p className="mt-3 text-base text-[#6C8572]">Khám phá và đăng ký khóa học phù hợp với bạn</p>

        {/* Search bar */}
        <div className="mx-auto mt-6 flex max-w-md items-center gap-3 rounded-full border border-[#B3CCBC] bg-[#F7FAF8] px-4 py-2 focus-within:border-[#166534] focus-within:ring-[3px] focus-within:ring-[rgba(22,101,52,0.15)] transition">
          <Search className="h-4 w-4 shrink-0 text-[#6C8572]" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Tìm khóa học, mã môn..."
            className="flex-1 bg-transparent text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572]"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(0); }}
              className="text-xs text-[#6C8572] hover:text-[#0A1F12] transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-[#B3CCBC]" />
            <h3 className="mt-4 text-lg font-semibold text-[#0A1F12]">
              {search ? `Không tìm thấy kết quả cho "${search}"` : "Chưa có khóa học nào"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[#6C8572]">
              {search ? "Thử tìm kiếm với từ khóa khác." : "Các khóa học sẽ sớm được thêm vào."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-[#6C8572]">
              {data?.totalElements ?? 0} khóa học{search ? ` cho "${search}"` : ""}
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => {
                const isEnrolled = enrolledIds.has(course.id);
                const price = (course as any).price ?? 0;
                const pending = enrollMutation.isPending || checkoutMutation.isPending;

                return (
                  <div
                    key={course.id}
                    className="group flex flex-col rounded-2xl border border-[#B3CCBC] bg-white transition hover:border-[#6C8572] hover:shadow-[0_4px_16px_rgba(13,92,49,0.08)]"
                  >
                    {/* Thumbnail */}
                    <div className="flex h-36 items-center justify-center rounded-t-2xl bg-[#EEF7F2]">
                      <GraduationCap className="h-12 w-12 text-[#B3CCBC]" />
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                          {(course as any).code ?? "—"}
                        </span>
                        {isEnrolled && (
                          <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                            Đã đăng ký
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold leading-snug text-[#0A1F12] line-clamp-2">
                        {(course as any).title ?? (course as any).name ?? `Khóa học #${course.id}`}
                      </h3>

                      <p className="flex-1 text-xs text-[#6C8572] line-clamp-2">
                        {(course as any).description ?? "Khóa học thuộc chương trình đào tạo."}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-[#0A1F12]">
                          {price > 0 ? `${price.toLocaleString("vi-VN")} ₫` : "Miễn phí"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-[#6C8572]">
                          <BookOpen className="h-3.5 w-3.5" />
                          {(course as any).creditValue
                            ? `${(course as any).creditValue} tín chỉ`
                            : ""}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAction(course.id, price)}
                        disabled={pending}
                        className={`mt-1 h-10 w-full rounded-lg text-sm font-semibold transition disabled:opacity-45 ${
                          isEnrolled
                            ? "border border-[#2D6A4C] bg-[#EEF7F2] text-[#166534] hover:bg-[#D5EADE]"
                            : "bg-[#166534] text-white hover:bg-[#0D5C31]"
                        }`}
                      >
                        {pending && !isEnrolled ? (
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        ) : isEnrolled ? (
                          "Tiếp tục học"
                        ) : price > 0 ? (
                          "Mua khóa học"
                        ) : (
                          "Đăng ký miễn phí"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
                >
                  ← Trước
                </button>
                <span className="text-sm text-[#6C8572]">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2] disabled:opacity-40"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
