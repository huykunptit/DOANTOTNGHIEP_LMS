import { ArrowRight, BookOpen, CalendarRange, ClipboardList, Layers3, School } from "lucide-react";

const items = [
  ["Academic years", "2024 - 2025"],
  ["Programs", "12 active"],
  ["Curricula", "34 published"],
  ["Enrollments", "4,820"],
];

const menu = [
  "Academic years",
  "Terms and semesters",
  "Programs and majors",
  "Cohorts and classes",
  "Curriculum editor",
  "Enrollment records",
];

export default function AdminAcademicPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">Academic management</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Structure the academic system</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Manage years, terms, programs, cohorts, curricula, and enrollment flow in one place.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">
            Open curriculum editor <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          {items.map(([label, value]) => {
            const iconMap: Record<string, React.ElementType> = {
              "Academic years": CalendarRange,
              Programs: School,
              Curricula: Layers3,
              Enrollments: ClipboardList,
            };
            const Icon = iconMap[label];
            return (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-sm">{label}</span>
                  <Icon className="h-5 w-5 text-blue-200" />
                </div>
                <div className="mt-3 text-3xl font-semibold">{value}</div>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Academic menu</h2>
            <div className="mt-5 space-y-3">
              {menu.map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5">
                  <span>{item}</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 text-blue-200">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-white">Curriculum overview</h2>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["Software Engineering", "Core curriculum and elective mapping"],
                ["Information Technology", "Course groups and class sections"],
                ["Business Administration", "Program outcomes and credit rules"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                  <h3 className="text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
