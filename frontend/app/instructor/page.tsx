"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, CheckCircle2, Users } from "lucide-react";
import { getInstructorDashboard } from "@/lib/api";

export default function InstructorDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["instructor-dashboard"],
    queryFn: getInstructorDashboard,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">Instructor</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Teaching workspace</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Monitor course performance, assignments, and learning progress across your classes.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">
            Create lesson <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {(data?.stats ?? [
            { title: "Courses", value: "8", delta: "+2" },
            { title: "Students", value: "1,240", delta: "+110" },
            { title: "Assignments", value: "36", delta: "12 pending" },
          ]).map((item) => (
            <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-slate-400">{item.title}</div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-semibold">{item.value}</div>
                <div className="text-sm font-medium text-emerald-300">{item.delta}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 text-blue-200">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-white">My courses</h2>
            </div>
            <div className="mt-5 space-y-4">
              {(data?.courses ?? []).map((course) => (
                <div key={course.id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{course.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{course.students} students enrolled</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{course.status}</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
              {isLoading && <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-slate-400">Loading courses...</div>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-blue-200">
                <Users className="h-5 w-5" />
                <h2 className="text-lg font-semibold text-white">Student attention</h2>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "15 students need intervention",
                  "8 assignments pending review",
                  "3 lessons need content update",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">{item}</div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-blue-200">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold text-white">Quick actions</h2>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  "Open gradebook",
                  "Review submissions",
                  "Publish announcement",
                  "Manage quiz bank",
                ].map((item) => (
                  <button key={item} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5">
                    <span>{item}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
