"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, PlayCircle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCourse } from "@/lib/api";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", params.id],
    queryFn: () => getCourse(params.id),
  });

  if (isLoading || !course) {
    return <main className="min-h-screen bg-slate-950 text-white px-6 py-8 lg:px-8"><div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/5 p-10 animate-pulse">Loading course...</div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">Course detail</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{course.description}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-2">{course.level}</span>
              <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 flex items-center gap-2"><Star className="h-4 w-4 text-amber-300" /> {course.rating} rating</span>
              <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 flex items-center gap-2"><Clock3 className="h-4 w-4 text-blue-200" /> {course.lessons} lessons</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Instructor", course.instructor],
                ["Updated", course.updatedAt],
                ["Duration", course.duration],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-sm text-slate-400">{label}</div>
                  <div className="mt-1 text-base font-medium">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold">Learning outcomes</h2>
              <div className="mt-4 space-y-3">
                {course.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-blue-200" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current progress</p>
                  <div className="mt-1 text-3xl font-semibold">{course.progress}%</div>
                </div>
                <PlayCircle className="h-6 w-6 text-blue-200" />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${course.progress}%` }} />
              </div>
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">
                Continue learning <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Course contents</h2>
              <div className="mt-5 space-y-3">
                {course.lessonsList.map((lesson, index) => (
                  <div key={lesson.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">{index + 1}. {lesson.title}</div>
                      <div className="text-xs text-slate-400">Lesson</div>
                    </div>
                    <span className="text-sm text-slate-400">{lesson.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Schedule</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"><CalendarDays className="h-4 w-4 text-blue-200" /> Weekly live review: Friday 19:00</div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"><Clock3 className="h-4 w-4 text-blue-200" /> Next checkpoint: Lesson 4 quiz</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
