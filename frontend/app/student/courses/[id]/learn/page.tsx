"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourse, getCourseContent, tickLessonProgress, getQuestions, postQuestion,
  getAssignmentByLesson, getMySubmission, submitAssignment,
  type LessonResponse,
} from "@/lib/api/course.api";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2, ChevronRight, ClipboardList, FileText, HelpCircle,
  List, Loader2, MessageCircle, PlayCircle, Send, X,
} from "lucide-react";
import { toast } from "sonner";

export default function LearningWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id as string;

  const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
  const [showMobileList, setShowMobileList] = useState(false);
  const [forumQuestion, setForumQuestion] = useState("");
  const [submittingQ, setSubmittingQ] = useState(false);
  const [assignmentContent, setAssignmentContent] = useState("");
  const [assignmentFileUrl, setAssignmentFileUrl] = useState("");

  const { data: course } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourse(courseId),
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ["course_content", courseId],
    queryFn: () => getCourseContent(courseId),
  });

  const { data: questions = [], refetch: refetchQuestions } = useQuery({
    queryKey: ["forum", courseId],
    queryFn: () => getQuestions(courseId),
    enabled: !!courseId,
  });

  const { data: assignment } = useQuery({
    queryKey: ["assignment_lesson", activeLesson?.id],
    queryFn: () => getAssignmentByLesson(activeLesson!.id),
    enabled: !!activeLesson?.id,
    retry: false,
  });

  const { data: mySubmission, refetch: refetchSubmission } = useQuery({
    queryKey: ["my_submission", assignment?.id],
    queryFn: () => getMySubmission(assignment!.id),
    enabled: !!assignment?.id,
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: () => submitAssignment(assignment!.id, {
      content: assignmentContent,
      fileUrl: assignmentFileUrl,
    }),
    onSuccess: () => {
      toast.success("Đã nộp bài tập!");
      setAssignmentContent("");
      setAssignmentFileUrl("");
      refetchSubmission();
    },
    onError: () => toast.error("Không thể nộp bài. Vui lòng thử lại."),
  });

  const handlePostQuestion = async () => {
    if (!forumQuestion.trim()) return;
    setSubmittingQ(true);
    try {
      await postQuestion(courseId, {
        title: forumQuestion.slice(0, 80),
        content: forumQuestion,
        lessonId: activeLesson?.id,
      });
      setForumQuestion("");
      refetchQuestions();
      toast.success("Đã đặt câu hỏi!");
    } catch {
      toast.error("Không thể đặt câu hỏi.");
    } finally {
      setSubmittingQ(false);
    }
  };

  const tickMutation = useMutation({
    mutationFn: (lessonId: number) => tickLessonProgress(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course_content", courseId] });
      toast.success("Đã đánh dấu hoàn thành!");
    },
  });

  useEffect(() => {
    if (sections && sections.length > 0 && !activeLesson) {
      const first = sections[0]?.lessons?.[0];
      if (first) setActiveLesson(first);
    }
  }, [sections, activeLesson]);

  const allLessons = sections?.flatMap((s) => s.lessons ?? []) ?? [];
  const completed = allLessons.filter((l) => l.isCompleted).length;
  const total = allLessons.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const nextLesson = (() => {
    if (!activeLesson || !allLessons.length) return null;
    const idx = allLessons.findIndex((l) => l.id === activeLesson.id);
    return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  })();

  const courseTitle = (course as any)?.title ?? (course as any)?.name ?? "Khóa học";

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-[#F7FAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#166534]" />
      </div>
    );
  }

  /* ── Lesson list panel (shared between sidebar and mobile sheet) ── */
  const LessonList = () => (
    <>
      {sections?.map((section) => (
        <div key={section.id}>
          <div className="sticky top-0 bg-[#EEF7F2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
            {section.title}
          </div>
          {section.lessons?.map((lesson) => {
            const isActive = activeLesson?.id === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => { setActiveLesson(lesson); setShowMobileList(false); }}
                className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition min-h-[52px] ${
                  isActive
                    ? "border-l-4 border-[#166534] bg-[#EEF7F2]"
                    : "border-l-4 border-transparent hover:bg-[#F7FAF8]"
                }`}
              >
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  lesson.isCompleted
                    ? "border-[#166534] bg-[#166534]"
                    : isActive
                    ? "border-[#166534]"
                    : "border-[#B3CCBC]"
                }`}>
                  {lesson.isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm leading-snug ${isActive ? "font-semibold text-[#0A1F12]" : "text-[#3E5448]"}`}>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-[#6C8572]">
                    {lesson.type === "VIDEO" ? "Video" : lesson.type === "QUIZ" ? "Quiz" : "Tài liệu"}
                    {lesson.duration ? ` • ${lesson.duration} phút` : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] bg-[#F7FAF8] overflow-hidden">
      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        {activeLesson ? (
          <div className="flex flex-1 flex-col">
            {/* Video area */}
            <div className="w-full bg-[#0A1F12] shrink-0">
              {activeLesson.type === "VIDEO" && activeLesson.videoUrl ? (
                <iframe
                  src={activeLesson.videoUrl}
                  className="aspect-video w-full"
                  allowFullScreen
                  title={activeLesson.title}
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center">
                  {activeLesson.type === "VIDEO"
                    ? <PlayCircle className="h-16 w-16 text-white/20" />
                    : <FileText className="h-16 w-16 text-white/20" />
                  }
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="flex-1 px-4 py-5 md:px-6 md:py-8 max-w-4xl mx-auto w-full">
              {/* Mobile: progress bar + lesson list toggle */}
              <div className="flex items-center gap-3 mb-4 md:hidden">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D5EADE]">
                      <div className="h-1.5 rounded-full bg-[#166534] transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#166534] shrink-0">{progress}%</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#6C8572]">{completed}/{total} bài</p>
                </div>
                <button
                  onClick={() => setShowMobileList(true)}
                  className="flex h-10 items-center gap-2 rounded-lg border border-[#B3CCBC] bg-white px-3 text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
                >
                  <List className="h-4 w-4" />
                  Bài học
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-[#0A1F12] md:text-2xl">{activeLesson.title}</h1>
                  {activeLesson.description && (
                    <p className="mt-2 text-sm text-[#6C8572]">{activeLesson.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!activeLesson.isCompleted && (
                    <button
                      onClick={() => tickMutation.mutate(activeLesson.id)}
                      disabled={tickMutation.isPending}
                      className="flex h-11 items-center gap-2 rounded-lg border border-[#2D6A4C] bg-[#EEF7F2] px-4 text-sm font-semibold text-[#166534] transition hover:bg-[#D5EADE] disabled:opacity-45"
                    >
                      {tickMutation.isPending
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <CheckCircle2 className="h-4 w-4" />
                      }
                      Hoàn thành
                    </button>
                  )}
                  {activeLesson.type === "QUIZ" && (
                    <button
                      onClick={() => router.push(`/student/courses/${courseId}/quiz/${activeLesson.id}`)}
                      className="flex h-11 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Làm bài kiểm tra
                    </button>
                  )}
                </div>
              </div>

              {nextLesson && (
                <div className="mt-6 border-t border-[#B3CCBC] pt-5">
                  <button
                    onClick={() => setActiveLesson(nextLesson)}
                    className="flex w-full items-center justify-between rounded-xl border border-[#B3CCBC] bg-white px-5 py-4 text-left transition hover:border-[#6C8572] hover:bg-[#EEF7F2]"
                  >
                    <div>
                      <p className="text-xs text-[#6C8572]">Bài tiếp theo</p>
                      <p className="mt-0.5 font-semibold text-[#0A1F12]">{nextLesson.title}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[#6C8572]" />
                  </button>
                </div>
              )}

              {/* ── Assignment ── */}
              {assignment && (
                <div className="mt-8 border-t border-[#B3CCBC] pt-6">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A1F12]">
                    <ClipboardList className="h-5 w-5 text-[#166534]" />
                    Bài tập
                  </h2>
                  <div className="mt-4 rounded-xl border border-[#B3CCBC] bg-white p-5">
                    <p className="font-semibold text-[#0A1F12]">{assignment.title}</p>
                    {assignment.description && (
                      <p className="mt-1 text-sm text-[#6C8572]">{assignment.description}</p>
                    )}

                    {mySubmission ? (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            mySubmission.status === "GRADED"
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : "bg-[#FEF9C3] text-[#854D0E]"
                          }`}>
                            {mySubmission.status === "GRADED" ? "Đã chấm điểm" : "Đã nộp"}
                          </span>
                          {mySubmission.status === "GRADED" && mySubmission.score !== undefined && (
                            <span className="text-sm font-semibold text-[#166534]">
                              Điểm: {mySubmission.score}
                            </span>
                          )}
                        </div>
                        {mySubmission.content && (
                          <p className="rounded-lg bg-[#F7FAF8] px-4 py-3 text-sm text-[#0A1F12]">
                            {mySubmission.content}
                          </p>
                        )}
                        {mySubmission.fileUrl && (
                          <a
                            href={mySubmission.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-[#166534] underline underline-offset-2"
                          >
                            Xem file đã nộp
                          </a>
                        )}
                        {mySubmission.feedback && (
                          <div className="rounded-lg border-l-4 border-[#166534] bg-[#EEF7F2] px-4 py-3">
                            <p className="text-xs font-semibold text-[#166534]">Nhận xét của giảng viên</p>
                            <p className="mt-0.5 text-sm text-[#0A1F12]">{mySubmission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={assignmentContent}
                          onChange={(e) => setAssignmentContent(e.target.value)}
                          rows={4}
                          placeholder="Nội dung bài làm..."
                          className="w-full resize-none rounded-xl border border-[#6C8572] bg-white px-4 py-3 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                        />
                        <input
                          type="text"
                          value={assignmentFileUrl}
                          onChange={(e) => setAssignmentFileUrl(e.target.value)}
                          placeholder="Link file nộp bài (Google Drive, GitHub...)"
                          className="w-full rounded-xl border border-[#6C8572] bg-white px-4 py-3 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                        />
                        <button
                          onClick={() => submitMutation.mutate()}
                          disabled={submitMutation.isPending || (!assignmentContent.trim() && !assignmentFileUrl.trim())}
                          className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
                        >
                          {submitMutation.isPending
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <Send className="h-4 w-4" />
                          }
                          Nộp bài
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Forum Q&A ── */}
              <div className="mt-8 border-t border-[#B3CCBC] pt-6">
                <h2 className="flex items-center gap-2 text-base font-semibold text-[#0A1F12]">
                  <MessageCircle className="h-5 w-5 text-[#166534]" />
                  Hỏi & Đáp ({(questions as any[]).length})
                </h2>

                {/* Post question */}
                <div className="mt-4 flex gap-3">
                  <textarea
                    value={forumQuestion}
                    onChange={(e) => setForumQuestion(e.target.value)}
                    rows={2}
                    placeholder="Đặt câu hỏi về bài học này…"
                    className="flex-1 resize-none rounded-xl border border-[#6C8572] bg-white px-4 py-3 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                  />
                  <button
                    onClick={handlePostQuestion}
                    disabled={submittingQ || !forumQuestion.trim()}
                    className="flex h-11 items-center gap-2 self-end rounded-xl bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
                  >
                    {submittingQ ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>

                {/* Question list */}
                {(questions as any[]).length > 0 && (
                  <div className="mt-5 space-y-3">
                    {(questions as any[]).slice(0, 10).map((q: any) => (
                      <div key={q.id} className="rounded-xl border border-[#B3CCBC] bg-white p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0D5C31] text-xs font-bold text-white">
                            {(q.authorName ?? q.userName ?? "U")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#3E5448]">
                              {q.authorName ?? q.userName ?? "Sinh viên"}
                              {q.instructorReply && (
                                <span className="ml-2 rounded-full bg-[#EEF7F2] px-2 py-0.5 text-[10px] font-semibold text-[#166534]">
                                  Đã được trả lời
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-sm text-[#0A1F12]">{q.content ?? q.title}</p>
                            {q.instructorReply && (
                              <div className="mt-3 rounded-lg border-l-4 border-[#166534] bg-[#EEF7F2] pl-3 pr-3 py-2">
                                <p className="text-xs font-semibold text-[#166534]">Giảng viên</p>
                                <p className="mt-0.5 text-sm text-[#0A1F12]">{q.instructorReply}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[#6C8572]">
            <PlayCircle className="h-12 w-12 text-[#B3CCBC]" />
            <p className="text-sm">Chọn bài học để bắt đầu</p>
          </div>
        )}
      </div>

      {/* ── Desktop sidebar ── */}
      <div className="hidden md:flex w-72 shrink-0 flex-col border-l border-[#B3CCBC] bg-white overflow-hidden">
        <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] p-4 shrink-0">
          <p className="text-sm font-semibold text-[#0A1F12] line-clamp-2">{courseTitle}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D5EADE]">
              <div className="h-1.5 rounded-full bg-[#166534] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-semibold text-[#166534]">{progress}%</span>
          </div>
          <p className="mt-1 text-xs text-[#6C8572]">{completed}/{total} bài hoàn thành</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <LessonList />
        </div>
      </div>

      {/* ── Mobile lesson list drawer (bottom sheet) ── */}
      {showMobileList && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowMobileList(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 flex max-h-[70dvh] flex-col rounded-t-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between border-b border-[#B3CCBC] bg-[#EEF7F2] px-4 py-3 rounded-t-2xl">
              <div>
                <p className="text-sm font-semibold text-[#0A1F12] line-clamp-1">{courseTitle}</p>
                <p className="text-xs text-[#6C8572]">{completed}/{total} bài hoàn thành • {progress}%</p>
              </div>
              <button
                onClick={() => setShowMobileList(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6C8572] transition hover:bg-[#E2F1E9] hover:text-[#0A1F12]"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Scrollable list */}
            <div className="overflow-y-auto">
              <LessonList />
              {/* Safe area spacer */}
              <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
