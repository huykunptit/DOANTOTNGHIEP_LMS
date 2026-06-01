"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Filter, Search, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/api";

const categories = ["All", "Programming", "Business", "Design", "AI", "Exam Prep"];

export default function CoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">Courses</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Browse the learning catalog</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Explore curated courses, compare options, and continue learning in one focused workspace.</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Search className="h-4 w-4" /> Search courses
            </label>
          </div>
        </header>

        <section className="mt-6 flex flex-wrap gap-2">
          {categories.map((item, index) => (
            <button key={item} className={`rounded-full px-4 py-2 text-sm transition ${index === 0 ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>
              {item}
            </button>
          ))}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 rounded-[2rem] border border-white/10 bg-white/5 animate-pulse" />
              ))
            : courses.map((course) => (
                <article key={course.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-blue-200/80">{course.category}</p>
                        <h2 className="mt-1 text-xl font-semibold">{course.title}</h2>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{course.level}</div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-400">Practical learning path with structured lessons, progress tracking, and clear outcomes.</p>

                  <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="text-slate-400">Lessons</div>
                      <div className="mt-1 text-lg font-semibold">{course.lessons}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="text-slate-400">Rating</div>
                      <div className="mt-1 flex items-center gap-1 text-lg font-semibold"><Star className="h-4 w-4 text-amber-300" /> {course.rating}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="text-slate-400">Price</div>
                      <div className="mt-1 text-lg font-semibold">{course.price}</div>
                    </div>
                  </div>

                  {typeof course.progress === "number" && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-slate-400">Open course details</span>
                    <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-100">
                      View course <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
        </section>
      </div>
    </main>
  );
}
