"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuizForStudent, submitQuiz } from "@/lib/api/course.api";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, Clock, HelpCircle, Loader2, XCircle,
} from "lucide-react";
import Link from "next/link";

export default function StudentQuizPage() {
  const params = useParams();
  const courseId = params.id as string;
  const quizId = Number(params.quizId);
  const router = useRouter();

  const [phase, setPhase] = useState<"start" | "taking" | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<any>(null);

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["student-quiz", quizId],
    queryFn: () => getQuizForStudent(quizId),
  });

  const submitMutation = useMutation({
    mutationFn: (data: Record<number, number>) => submitQuiz(quizId, data),
    onSuccess: (res) => {
      setResult(res);
      setPhase("result");
      toast.success("Đã nộp bài kiểm tra!");
    },
    onError: () => toast.error("Nộp bài thất bại, vui lòng thử lại."),
  });

  useEffect(() => {
    if (phase !== "taking") return;
    if (timeLeft <= 0) {
      submitMutation.mutate(answers);
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft]);

  const handleStart = () => {
    setTimeLeft((quiz?.timeLimit ?? 30) * 60);
    setPhase("taking");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#166534]" />
      </div>
    );
  }

  /* ── START SCREEN ── */
  if (phase === "start") {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <Link
          href={`/student/courses/${courseId}/learn`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6C8572] transition hover:text-[#166534]"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại bài học
        </Link>

        <div className="rounded-2xl border border-[#B3CCBC] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF7F2]">
              <HelpCircle className="h-8 w-8 text-[#166534]" />
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#0A1F12]">{quiz?.title}</h1>
          {quiz?.description && (
            <p className="mt-2 text-sm text-[#6C8572]">{quiz.description}</p>
          )}

          <div className="mt-7 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] p-4 text-center">
              <p className="text-xs text-[#6C8572]">Thời gian</p>
              <p className="mt-1 text-xl font-bold text-[#0A1F12]">{quiz?.timeLimit ?? 30}</p>
              <p className="text-xs text-[#6C8572]">phút</p>
            </div>
            <div className="rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] p-4 text-center">
              <p className="text-xs text-[#6C8572]">Điểm đạt</p>
              <p className="mt-1 text-xl font-bold text-[#166534]">{quiz?.passScore ?? 50}</p>
              <p className="text-xs text-[#6C8572]">%</p>
            </div>
            <div className="rounded-xl border border-[#B3CCBC] bg-[#F7FAF8] p-4 text-center">
              <p className="text-xs text-[#6C8572]">Câu hỏi</p>
              <p className="mt-1 text-xl font-bold text-[#0A1F12]">{quiz?.questions?.length ?? 0}</p>
              <p className="text-xs text-[#6C8572]">câu</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="mt-8 h-12 w-full rounded-xl bg-[#166534] text-base font-semibold text-white transition hover:bg-[#0D5C31]"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    );
  }

  /* ── RESULT SCREEN ── */
  if (phase === "result") {
    const passed = result?.passed;
    return (
      <div className="mx-auto max-w-lg space-y-6 py-8">
        <div className="rounded-2xl border border-[#B3CCBC] bg-white p-8 text-center shadow-[0_4px_16px_rgba(13,92,49,0.08)]">
          <div className="flex justify-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${passed ? "bg-[#DCFCE7]" : "bg-[#FEE2E2]"}`}>
              {passed
                ? <CheckCircle2 className="h-10 w-10 text-[#166534]" />
                : <XCircle className="h-10 w-10 text-[#DC2626]" />
              }
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#0A1F12]">
            {passed ? "Chúc mừng bạn đã đạt!" : "Chưa đạt lần này"}
          </h1>
          <p className="mt-2 text-sm text-[#6C8572]">
            {passed
              ? "Bạn đã vượt qua bài kiểm tra thành công."
              : "Bạn chưa đạt điểm tối thiểu. Hãy ôn tập và thử lại."}
          </p>

          <div className="mt-7 inline-block rounded-2xl border border-[#B3CCBC] px-8 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Điểm của bạn</p>
            <p className={`mt-2 text-6xl font-bold ${passed ? "text-[#166534]" : "text-[#DC2626]"}`}>
              {result?.score ?? 0}%
            </p>
            <p className="mt-2 text-xs text-[#6C8572]">Yêu cầu: {quiz?.passScore ?? 50}%</p>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              href={`/student/courses/${courseId}/learn`}
              className="flex h-11 items-center justify-center rounded-xl border border-[#B3CCBC] text-sm font-medium text-[#3E5448] transition hover:bg-[#EEF7F2]"
            >
              Quay lại khóa học
            </Link>
            {!passed && (
              <button
                onClick={() => { setAnswers({}); setPhase("start"); setResult(null); }}
                className="flex h-11 items-center justify-center rounded-xl bg-[#166534] text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
              >
                Làm lại bài kiểm tra
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── TAKING SCREEN ── */
  return (
    <div className="mx-auto max-w-3xl pb-12">
      {/* Sticky timer bar */}
      <div className="sticky top-14 z-30 flex items-center justify-between rounded-xl border border-[#B3CCBC] bg-white px-5 py-3 shadow-[0_4px_12px_rgba(13,92,49,0.08)] mb-6">
        <span className="text-sm font-semibold text-[#0A1F12]">{quiz?.title}</span>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft < 60 ? "text-[#DC2626]" : "text-[#166534]"}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-5">
        {quiz?.questions?.map((q: any, i: number) => (
          <div key={q.id} className="rounded-2xl border border-[#B3CCBC] bg-white p-6">
            <h3 className="font-semibold text-[#0A1F12]">
              <span className="mr-2 text-[#6C8572]">{i + 1}.</span>
              {q.content}
            </h3>
            <div className="mt-4 space-y-2.5">
              {q.answers?.map((a: any) => {
                const selected = answers[q.id] === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: a.id }))}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      selected
                        ? "border-[#166534] bg-[#EEF7F2] font-medium text-[#0A1F12]"
                        : "border-[#B3CCBC] bg-white text-[#3E5448] hover:border-[#6C8572] hover:bg-[#F7FAF8]"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      selected ? "border-[#166534] bg-[#166534] text-white" : "border-[#B3CCBC] text-[#6C8572]"
                    }`}>
                      {selected ? "✓" : String.fromCharCode(65 + q.answers.indexOf(a))}
                    </span>
                    {a.content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit bar */}
      <div className="sticky bottom-4 mt-8 flex items-center justify-between rounded-xl border border-[#B3CCBC] bg-white px-5 py-3 shadow-[0_4px_16px_rgba(13,92,49,0.12)]">
        <span className="text-sm text-[#6C8572]">
          Đã trả lời{" "}
          <span className="font-semibold text-[#0A1F12]">{Object.keys(answers).length}</span>
          {" "}/ {quiz?.questions?.length ?? 0}
        </span>
        <button
          onClick={() => submitMutation.mutate(answers)}
          disabled={submitMutation.isPending}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#166534] px-5 text-sm font-semibold text-white transition hover:bg-[#0D5C31] disabled:opacity-45"
        >
          {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Nộp bài
        </button>
      </div>
    </div>
  );
}
