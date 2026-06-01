import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  { label: "Active learners", value: "12k+" },
  { label: "Courses shipped", value: "240" },
  { label: "Completion rate", value: "91%" },
];

const features = [
  {
    icon: BookOpen,
    title: "Course-first experience",
    description: "Browse, enroll, and continue learning without friction.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based operations",
    description: "Student, instructor, and admin flows stay clearly separated.",
  },
  {
    icon: Sparkles,
    title: "Focused interface",
    description: "A calm, modern UI with strong hierarchy and clean data views.",
  },
];

const categories = ["Computer Science", "Business", "Engineering", "Language", "Design", "Exam Prep"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_24%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 lg:px-8">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-blue-200/80">ERIPT LMS</p>
              <h1 className="mt-2 text-lg font-semibold tracking-tight sm:text-2xl">University learning system</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/90 transition hover:bg-white/10">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-100">
                Start now
              </Link>
            </div>
          </header>

          <div className="grid flex-1 gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-blue-100/80 backdrop-blur">
                <GraduationCap className="h-4 w-4" /> Learning made organized
              </div>
              <h2 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
                One platform for learning, teaching, and administration.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                A premium LMS experience with role-based dashboards, course management, and academic operations in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
                  Open dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/register" className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10">
                  Create account
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="text-3xl font-semibold">{item.value}</div>
                    <div className="mt-2 text-sm text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm text-slate-400">Platform focus</p>
                <div className="mt-3 text-2xl font-semibold text-white">Learning operations dashboard</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">Built for monitoring progress, managing users, and keeping academic flow clear.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 text-base font-medium">{item.title}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                <p className="text-sm font-medium text-white">Popular categories</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span key={category} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
