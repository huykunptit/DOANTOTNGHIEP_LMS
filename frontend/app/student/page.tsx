import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3, GraduationCap, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  { label: "Courses in progress", value: "5", delta: "+1 this week", icon: BookOpen },
  { label: "Completion rate", value: "78%", delta: "+6%", icon: CheckCircle2 },
  { label: "Learning time", value: "24h", delta: "This month", icon: Clock3 },
  { label: "Certificates", value: "3", delta: "Earned", icon: ShieldCheck },
];

const continueLearning = [
  { title: "Spring Boot Fundamentals", progress: 72, lesson: "Security configuration" },
  { title: "Database Design", progress: 48, lesson: "Normalization patterns" },
  { title: "Frontend Systems", progress: 35, lesson: "Dashboard layouts" },
];

const schedule = [
  ["Live class", "Java backend review", "Today • 19:00"],
  ["Deadline", "Assignment 2 submission", "Tomorrow • 23:59"],
  ["Exam", "Midterm assessment", "Fri • 08:30"],
];

const achievements = [
  "Completed 12 lessons this month",
  "Maintained 8-day study streak",
  "Top 15% in course activity",
];

export default function StudentDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/70 px-5 py-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Student</p>
              <h1 className="text-lg font-semibold">Learning Hub</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm">
            {[
              ["Dashboard", true],
              ["My courses", false],
              ["Schedule", false],
              ["Certificates", false],
              ["Transcript", false],
              ["Exams", false],
              ["Profile", false],
            ].map(([label, active]) => (
              <div
                key={label as string}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5"}`}
              >
                <span>{label as string}</span>
                <ArrowRight className="h-4 w-4 opacity-60" />
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex flex-col">
          <header className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm text-slate-400">Good evening</p>
              <h2 className="text-2xl font-semibold tracking-tight">Continue your learning journey</h2>
            </div>
            <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">Resume next lesson</button>
          </header>

          <main className="flex-1 space-y-8 px-6 py-6 lg:px-8">
            <section className="grid gap-4 lg:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-sm">{item.label}</span>
                      <Icon className="h-5 w-5 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div className="text-3xl font-semibold">{item.value}</div>
                      <div className="text-sm font-medium text-emerald-300">{item.delta}</div>
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Continue learning</h3>
                    <p className="mt-1 text-sm text-slate-400">Pick up from the latest lesson in each active course.</p>
                  </div>
                  <PlayCircle className="h-5 w-5 text-blue-200" />
                </div>

                <div className="mt-6 space-y-4">
                  {continueLearning.map((course) => (
                    <div key={course.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-medium">{course.title}</h4>
                          <p className="mt-1 text-sm text-slate-400">Next lesson: {course.lesson}</p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{course.progress}%</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Today&apos;s schedule</h3>
                      <p className="mt-1 text-sm text-slate-400">Classes, deadlines, and assessments.</p>
                    </div>
                    <CalendarDays className="h-5 w-5 text-blue-200" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {schedule.map(([type, title, time]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-blue-200/80">{type}</p>
                        <div className="mt-2 font-medium">{title}</div>
                        <p className="mt-1 text-sm text-slate-400">{time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 text-blue-200">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="text-lg font-semibold text-white">Achievements</h3>
                  </div>
                  <div className="mt-5 space-y-3">
                    {achievements.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </section>
      </div>
    </main>
  );
}
