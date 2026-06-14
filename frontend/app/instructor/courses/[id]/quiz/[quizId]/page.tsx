"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuizForTeacher, addQuestionToQuiz } from "@/lib/api/course.api";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, Circle, Clock, HelpCircle,
  Loader2, Plus, Star, Trash2,
} from "lucide-react";
import Link from "next/link";

const inputCls =
  "h-12 w-full rounded-xl border border-[#6C8572] bg-white px-4 text-base text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition";

const EMPTY_FORM = {
  content: "",
  type: "SINGLE_CHOICE",
  difficulty: 1,
  defaultScore: 1,
  answers: [
    { content: "", isCorrect: true },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ],
};

export default function QuizBuilderPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const quizId = Number(params.quizId);
  const qc = useQueryClient();

  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizForTeacher(quizId),
  });

  const questionMutation = useMutation({
    mutationFn: (data: any) => addQuestionToQuiz(quizId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quiz", quizId] });
      toast.success("Đã thêm câu hỏi!");
      setShowDialog(false);
      setForm(EMPTY_FORM);
    },
    onError: () => toast.error("Thêm câu hỏi thất bại"),
  });

  const handleSave = () => {
    if (!form.content.trim()) return toast.error("Vui lòng nhập nội dung câu hỏi.");
    const valid = form.answers.filter((a) => a.content.trim());
    if (valid.length < 2) return toast.error("Cần ít nhất 2 đáp án.");
    if (!valid.some((a) => a.isCorrect)) return toast.error("Cần chọn ít nhất 1 đáp án đúng.");
    questionMutation.mutate({
      content: form.content,
      type: form.type,
      difficulty: form.difficulty,
      defaultScore: form.defaultScore,
      answers: valid,
    });
  };

  const setCorrect = (i: number) =>
    setForm({ ...form, answers: form.answers.map((a, idx) => ({ ...a, isCorrect: idx === i })) });

  const setAnswerText = (i: number, text: string) => {
    const a = [...form.answers];
    a[i] = { ...a[i], content: text };
    setForm({ ...form, answers: a });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#B3CCBC] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            href={`/instructor/courses/${courseId}`}
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#6C8572] transition hover:text-[#166534]"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại khóa học
          </Link>
          <h1 className="text-2xl font-bold text-[#0A1F12]">{quiz?.title ?? "Quiz Builder"}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6C8572]">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {quiz?.timeLimit ?? 30} phút
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Điểm đạt: {quiz?.passScore ?? 50}%
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              {quiz?.questions?.length ?? 0} câu hỏi
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
        >
          <Plus className="h-4 w-4" /> Thêm câu hỏi
        </button>
      </div>

      {/* Questions list */}
      {(!quiz?.questions || quiz.questions.length === 0) ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#B3CCBC] bg-white py-16 text-center">
          <HelpCircle className="h-10 w-10 text-[#B3CCBC]" />
          <h3 className="mt-3 text-base font-semibold text-[#0A1F12]">Chưa có câu hỏi</h3>
          <p className="mt-1 text-sm text-[#6C8572]">Thêm câu hỏi MCQ đầu tiên cho bài kiểm tra.</p>
          <button
            onClick={() => setShowDialog(true)}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            <Plus className="h-4 w-4" /> Thêm câu hỏi đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {quiz.questions.map((q: any, i: number) => (
            <div key={q.id} className="rounded-2xl border border-[#B3CCBC] bg-white overflow-hidden">
              <div className="flex items-start gap-4 border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0D5C31] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <p className="flex-1 font-semibold text-[#0A1F12]">{q.content}</p>
                <span className="rounded-full bg-[#EEF7F2] px-2.5 py-0.5 text-xs font-medium text-[#166534] border border-[#B3CCBC]">
                  {q.defaultScore ?? 1} điểm
                </span>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-2">
                {q.answers?.map((a: any) => (
                  <div
                    key={a.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                      a.isCorrect
                        ? "border-[#2D6A4C] bg-[#DCFCE7] text-[#166534]"
                        : "border-[#B3CCBC] bg-[#F7FAF8] text-[#3E5448]"
                    }`}
                  >
                    {a.isCorrect
                      ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" />
                      : <Circle className="h-4 w-4 shrink-0 text-[#B3CCBC]" />
                    }
                    <span className={a.isCorrect ? "font-semibold" : ""}>{a.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add question dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-10" onClick={() => setShowDialog(false)}>
          <div className="absolute inset-0 bg-[rgba(10,31,18,0.4)]" />
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-[#B3CCBC] bg-white shadow-[0_4px_32px_rgba(13,92,49,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#B3CCBC] bg-[#EEF7F2] px-6 py-4 rounded-t-2xl">
              <h3 className="text-lg font-bold text-[#0A1F12]">Thêm câu hỏi MCQ</h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Question content */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  Nội dung câu hỏi *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={3}
                  placeholder="Nhập câu hỏi tại đây…"
                  className="w-full resize-none rounded-xl border border-[#6C8572] bg-white px-4 py-3 text-sm text-[#0A1F12] outline-none placeholder:text-[#6C8572] focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)] transition"
                  autoFocus
                />
              </div>

              {/* Difficulty + Score */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                    Độ khó (1–5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                    Điểm
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.defaultScore}
                    onChange={(e) => setForm({ ...form, defaultScore: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Answers */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.05em] text-[#3E5448]">
                  Đáp án — bấm ✓ để chọn đáp án đúng
                </label>
                <div className="space-y-2.5">
                  {form.answers.map((answer, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCorrect(i)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                          answer.isCorrect
                            ? "border-[#166534] bg-[#166534] text-white"
                            : "border-[#B3CCBC] text-[#B3CCBC] hover:border-[#166534] hover:text-[#166534]"
                        }`}
                      >
                        {answer.isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </button>
                      <input
                        value={answer.content}
                        onChange={(e) => setAnswerText(i, e.target.value)}
                        placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
                        className={`flex-1 h-11 rounded-xl border px-4 text-sm text-[#0A1F12] outline-none transition ${
                          answer.isCorrect
                            ? "border-[#2D6A4C] bg-[#EEF7F2] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)]"
                            : "border-[#B3CCBC] bg-white focus:border-[#166534] focus:ring-[3px] focus:ring-[rgba(22,101,52,0.15)]"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#B3CCBC] px-6 py-4">
              <button
                onClick={() => setShowDialog(false)}
                className="h-10 rounded-lg border border-[#B3CCBC] px-5 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={questionMutation.isPending}
                className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
              >
                {questionMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Lưu câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
