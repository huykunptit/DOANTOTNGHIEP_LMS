"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourse, getCourseContent, createSection, createLesson, uploadMedia, createQuiz,
} from "@/lib/api/course.api";
import { toast } from "sonner";
import {
  ChevronDown, ChevronRight, FileQuestion, FileText, GripVertical,
  Loader2, Plus, Settings, UploadCloud, Users, Video,
} from "lucide-react";
import Link from "next/link";

const inputCls =
  "h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition";

export default function CourseBuilderPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const qc = useQueryClient();
  const router = useRouter();

  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [sectionDialog, setSectionDialog] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const [lessonDialog, setLessonDialog] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", type: "VIDEO", videoUrl: "" });
  const [uploading, setUploading] = useState(false);

  const [quizDialog, setQuizDialog] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: "", timeLimit: 30, passScore: 50 });

  const [activeTab, setActiveTab] = useState<"curriculum" | "quizzes">("curriculum");

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const { data: sections = [], isLoading: loadingSections } = useQuery({
    queryKey: ["course-content", courseId],
    queryFn: () => getCourseContent(courseId),
  });

  const sectionMutation = useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course-content", courseId] });
      toast.success("Đã tạo section!");
      setSectionDialog(false);
      setNewSectionTitle("");
    },
    onError: () => toast.error("Tạo section thất bại"),
  });

  const lessonMutation = useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["course-content", courseId] });
      toast.success("Đã thêm bài học!");
      setLessonDialog(false);
      setLessonForm({ title: "", type: "VIDEO", videoUrl: "" });
    },
    onError: () => toast.error("Thêm bài học thất bại"),
  });

  const quizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["course-content", courseId] });
      toast.success("Đã tạo quiz!");
      setQuizDialog(false);
      router.push(`/instructor/courses/${courseId}/quiz/${res.id}`);
    },
    onError: () => toast.error("Tạo quiz thất bại"),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadMedia(file, "course_lesson_video");
      setLessonForm({ ...lessonForm, videoUrl: res.filePath });
      toast.success("Upload thành công!");
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loadingCourse || loadingSections) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
      </div>
    );
  }

  const courseTitle = (course as any)?.title ?? (course as any)?.name ?? `Khóa học #${courseId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Biên soạn khóa học</p>
          <h1 className="mt-1 text-2xl font-bold text-[#0A1F12]">{courseTitle}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/instructor/courses/${courseId}/students`}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#B3CCBC] bg-white px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
          >
            <Users className="h-4 w-4" /> Học viên
          </Link>
          <Link
            href={`/instructor/courses/${courseId}/assignments`}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#B3CCBC] bg-white px-4 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
          >
            <Settings className="h-4 w-4" /> Bài tập nộp
          </Link>
          <button
            onClick={() => setSectionDialog(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            <Plus className="h-4 w-4" /> Thêm section
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#B3CCBC]">
        <div className="flex gap-0">
          {(["curriculum", "quizzes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "border-[#166534] text-[#166534]"
                  : "border-transparent text-[#6C8572] hover:border-[#B3CCBC]"
              }`}
            >
              {tab === "curriculum" ? "Nội dung khóa học" : "Quiz"}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum tab */}
      {activeTab === "curriculum" && (
        <div className="space-y-3">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-14 text-center">
              <FileText className="h-10 w-10 text-[#B3CCBC]" />
              <h3 className="mt-3 text-base font-semibold text-[#0A1F12]">Chưa có section nào</h3>
              <p className="mt-1 text-sm text-[#6C8572]">Bắt đầu bằng cách thêm section đầu tiên.</p>
              <button
                onClick={() => setSectionDialog(true)}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
              >
                <Plus className="h-4 w-4" /> Thêm section
              </button>
            </div>
          ) : (
            sections.map((section) => {
              const isOpen = openSections.has(section.id);
              return (
                <div key={section.id} className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between bg-[#EEF7F2] px-6 py-4 text-left"
                  >
                    <span className="font-semibold text-[#0A1F12]">{section.title}</span>
                    <div className="flex items-center gap-2 text-xs text-[#6C8572]">
                      <span>{section.lessons?.length ?? 0} bài</span>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 space-y-2">
                      {(!section.lessons || section.lessons.length === 0) ? (
                        <p className="py-2 text-sm italic text-[#6C8572]">Chưa có bài học nào.</p>
                      ) : (
                        section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] px-4 py-3"
                          >
                            <GripVertical className="h-4 w-4 text-[#B3CCBC] cursor-grab" />
                            {lesson.type === "VIDEO" && <Video className="h-4 w-4 text-[#1D4ED8]" />}
                            {lesson.type === "DOCUMENT" && <FileText className="h-4 w-4 text-[#166534]" />}
                            {lesson.type === "QUIZ" && <FileQuestion className="h-4 w-4 text-[#B45309]" />}
                            <span className="flex-1 text-sm font-medium text-[#0A1F12]">{lesson.title}</span>
                            <span className="rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534]">
                              {lesson.type}
                            </span>
                          </div>
                        ))
                      )}
                      <button
                        onClick={() => { setActiveSectionId(section.id); setLessonDialog(true); }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#B3CCBC] py-3 text-sm font-medium text-[#6C8572] transition hover:border-[#166534] hover:text-[#166534]"
                      >
                        <Plus className="h-4 w-4" /> Thêm bài học
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quizzes tab */}
      {activeTab === "quizzes" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setQuizDialog(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
            >
              <Plus className="h-4 w-4" /> Tạo Quiz mới
            </button>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-[#B3CCBC] bg-white py-12 text-center">
            <FileQuestion className="h-10 w-10 text-[#B3CCBC]" />
            <h3 className="mt-3 text-base font-semibold text-[#0A1F12]">Quản lý Quiz</h3>
            <p className="mt-1 max-w-xs text-sm text-[#6C8572]">
              Tạo quiz mới và thêm câu hỏi MCQ trong trình biên soạn quiz.
            </p>
          </div>
        </div>
      )}

      {/* === Dialogs === */}

      {/* Section dialog */}
      {sectionDialog && (
        <Modal title="Thêm Section mới" onClose={() => setSectionDialog(false)}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
              Tên section
            </label>
            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="VD: Giới thiệu khóa học"
              className={inputCls}
              autoFocus
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setSectionDialog(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]">
              Hủy
            </button>
            <button
              onClick={() => { if (newSectionTitle.trim()) sectionMutation.mutate({ courseId, title: newSectionTitle }); }}
              disabled={sectionMutation.isPending || !newSectionTitle.trim()}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {sectionMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </Modal>
      )}

      {/* Lesson dialog */}
      {lessonDialog && (
        <Modal title="Thêm Bài học" onClose={() => setLessonDialog(false)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Tên bài học</label>
              <input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Tên bài học" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Loại</label>
              <select value={lessonForm.type} onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })} className={inputCls}>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Tài liệu</option>
                <option value="QUIZ">Quiz</option>
              </select>
            </div>
            {lessonForm.type === "VIDEO" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Upload Video</label>
                <label htmlFor="vid-upload" className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#B3CCBC] px-4 py-5 text-sm text-[#6C8572] transition hover:border-[#166534] hover:text-[#166534]">
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang upload…</> : <><UploadCloud className="h-4 w-4" /> Chọn file video</>}
                </label>
                <input id="vid-upload" type="file" className="hidden" accept="video/*" onChange={handleFileUpload} disabled={uploading} />
                {lessonForm.videoUrl && <p className="mt-1 truncate text-xs text-[#166534]">✓ {lessonForm.videoUrl}</p>}
                <div className="mt-2">
                  <input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="Hoặc dán URL video" className="h-10 w-full rounded-lg border border-[#B3CCBC] bg-white px-3 text-sm text-[#0A1F12] outline-none focus:border-[#166534] transition" />
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setLessonDialog(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]">Hủy</button>
            <button
              onClick={() => { if (lessonForm.title.trim() && activeSectionId) lessonMutation.mutate({ sectionId: activeSectionId, title: lessonForm.title, type: lessonForm.type, videoUrl: lessonForm.videoUrl || undefined }); }}
              disabled={lessonMutation.isPending || !lessonForm.title.trim() || uploading}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {lessonMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </Modal>
      )}

      {/* Quiz dialog */}
      {quizDialog && (
        <Modal title="Tạo Quiz mới" onClose={() => setQuizDialog(false)}>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Tên Quiz</label>
              <input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} placeholder="VD: Kiểm tra chương 1" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Thời gian (phút)</label>
                <input type="number" min={1} value={quizForm.timeLimit} onChange={(e) => setQuizForm({ ...quizForm, timeLimit: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">Điểm đạt (%)</label>
                <input type="number" min={1} max={100} value={quizForm.passScore} onChange={(e) => setQuizForm({ ...quizForm, passScore: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setQuizDialog(false)} className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]">Hủy</button>
            <button
              onClick={() => { if (quizForm.title.trim()) quizMutation.mutate({ courseId, title: quizForm.title, scope: "course", timeLimit: quizForm.timeLimit, passScore: quizForm.passScore }); }}
              disabled={quizMutation.isPending || !quizForm.title.trim()}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
            >
              {quizMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Tạo và mở Quiz Builder
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#B3CCBC] bg-white p-6 shadow-[0_4px_24px_rgba(13,92,49,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-[#0A1F12]">{title}</h3>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
