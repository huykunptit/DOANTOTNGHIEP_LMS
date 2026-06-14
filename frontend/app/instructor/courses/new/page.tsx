"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createCourse } from "@/lib/api";

export default function NewCoursePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
    price: 0,
    courseMode: "ONLINE",
    creditBearing: false,
    creditValue: 0,
    active: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createCourse({
        title: form.title,
        code: form.code,
        description: form.description || undefined,
        price: form.price,
        courseMode: form.courseMode,
        creditBearing: form.creditBearing,
        creditValue: form.creditBearing ? form.creditValue : undefined,
        active: form.active,
      }),
    onSuccess: (course) => {
      toast.success("Tạo khóa học thành công!");
      qc.invalidateQueries({ queryKey: ["instructor_courses"] });
      router.push(`/instructor/courses/${course.id}`);
    },
    onError: (err: Error) => toast.error(err.message || "Tạo khóa học thất bại"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.code.trim()) {
      toast.error("Tên và mã khóa học không được để trống");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <Link
        href="/instructor/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6C8572] transition hover:text-[#0A1F12]"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách khóa học
      </Link>

      <h1 className="text-2xl font-bold text-[#0A1F12]">Tạo khóa học mới</h1>

      <div className="rounded-2xl border border-[#B3CCBC] bg-white">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
          <h2 className="text-base font-semibold text-[#0A1F12]">Thông tin khóa học</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Field label="Tên khóa học *">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Nhập môn Lập trình Java"
              className={inputCls}
            />
          </Field>

          <Field label="Mã khóa học *">
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="VD: INT1339"
              className={inputCls}
            />
          </Field>

          <Field label="Mô tả">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Mô tả nội dung và mục tiêu khóa học..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Hình thức">
              <select
                value={form.courseMode}
                onChange={(e) => setForm({ ...form, courseMode: e.target.value })}
                className={inputCls}
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </Field>

            <Field label="Giá (VNĐ)">
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-[#3E5448]">
              <input
                type="checkbox"
                checked={form.creditBearing}
                onChange={(e) => setForm({ ...form, creditBearing: e.target.checked })}
                className="h-4 w-4 rounded border-[#6C8572] accent-[#166534]"
              />
              Tính tín chỉ
            </label>

            {form.creditBearing && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#6C8572]">Số tín chỉ:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.creditValue}
                  onChange={(e) => setForm({ ...form, creditValue: Number(e.target.value) })}
                  className="w-16 rounded-lg border border-[#6C8572] bg-white px-3 py-1.5 text-sm text-[#0A1F12] outline-none focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                />
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-[#3E5448]">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded border-[#6C8572] accent-[#166534]"
              />
              Xuất bản ngay
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#B3CCBC]">
            <Link
              href="/instructor/courses"
              className="inline-flex h-10 items-center rounded-lg border border-[#B3CCBC] bg-transparent px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Tạo khóa học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
        {label}
      </label>
      {children}
    </div>
  );
}
