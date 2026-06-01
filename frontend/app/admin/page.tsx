import { BarChart3, BookOpen, CalendarDays, ChevronRight, CircleDollarSign, GraduationCap, LayoutDashboard, ListChecks, Search, ShieldCheck, Users } from "lucide-react";

const stats = [
  { label: "Total users", value: "8,420", delta: "+12%", icon: Users },
  { label: "Active courses", value: "246", delta: "+8%", icon: BookOpen },
  { label: "Published exams", value: "128", delta: "+6%", icon: ListChecks },
  { label: "Monthly revenue", value: "$42,800", delta: "+18%", icon: CircleDollarSign },
];

const tasks = [
  "Approve pending courses",
  "Review new instructor requests",
  "Check exam monitoring alerts",
  "Validate academic enrollments",
];

const activity = [
  ["New student registrations", "+320 today"],
  ["Course approvals completed", "18 items"],
  ["Payment confirmations", "124 transactions"],
  ["Academic updates synced", "6 changes"],
];

const departments = [
  ["Engineering", "2,145 students"],
  ["Business", "1,980 students"],
  ["IT", "2,760 students"],
  ["Languages", "1,535 students"],
];

const recentUsers = [
  ["Nguyen Van A", "Student", "Active"],
  ["Tran Thi B", "Instructor", "Pending"],
  ["Le Van C", "Admin", "Verified"],
  ["Pham Thi D", "Student", "Active"],
];

const notifications = [
  "15 courses waiting for approval",
  "3 exam violations flagged in monitor",
  "12 payment records need reconciliation",
  "7 academic changes synced successfully",
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/70 px-5 py-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Admin</p>
              <h1 className="text-lg font-semibold">Control Center</h1>
            </div>
          </div>

          <nav className="mt-8 space-y-2 text-sm">
            {[
              ["Overview", true],
              ["Users", false],
              ["Courses", false],
              ["Academic", false],
              ["Exams", false],
              ["Payments", false],
              ["Reports", false],
              ["Settings", false],
            ].map(([label, active]) => (
              <div
                key={label as string}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5"}`}
              >
                <span>{label as string}</span>
                <ChevronRight className="h-4 w-4 opacity-60" />
              </div>
            ))}
          </nav>
        </aside>

        <section className="flex flex-col">
          <header className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm text-slate-400">Overview</p>
              <h2 className="text-2xl font-semibold tracking-tight">Admin dashboard</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">Export report</button>
              <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">Create new</button>
            </div>
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

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Operational priorities</h3>
                      <p className="mt-1 text-sm text-slate-400">Tasks requiring immediate attention across the platform.</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-blue-200" />
                  </div>

                  <div className="mt-6 space-y-3">
                    {tasks.map((task, index) => (
                      <div key={task} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-sm font-semibold text-blue-200">0{index + 1}</span>
                          <span>{task}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Activity summary</h3>
                        <p className="mt-1 text-sm text-slate-400">Recent changes across key workflows.</p>
                      </div>
                      <CalendarDays className="h-5 w-5 text-blue-200" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {activity.map(([title, value]) => (
                        <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                          <p className="text-sm text-slate-400">{title}</p>
                          <div className="mt-2 text-lg font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center gap-3 text-blue-200">
                      <ShieldCheck className="h-5 w-5" />
                      <h3 className="text-lg font-semibold text-white">Compliance flags</h3>
                    </div>
                    <div className="mt-5 space-y-3">
                      {notifications.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <h3 className="text-lg font-semibold">Department distribution</h3>
                  <p className="mt-1 text-sm text-slate-400">Current enrollments by academic domain.</p>
                  <div className="mt-5 space-y-4">
                    {departments.map(([name, value]) => (
                      <div key={name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{name}</span>
                          <span className="text-slate-400">{value}</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${50 + name.length * 5}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Recent users</h3>
                      <p className="mt-1 text-sm text-slate-400">Latest account activity and verification state.</p>
                    </div>
                    <Search className="h-5 w-5 text-blue-200" />
                  </div>
                  <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                    <div className="grid grid-cols-[1.4fr_0.9fr_0.8fr] bg-slate-900/80 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                      <span>Name</span>
                      <span>Role</span>
                      <span>Status</span>
                    </div>
                    {recentUsers.map(([name, role, status]) => (
                      <div key={name} className="grid grid-cols-[1.4fr_0.9fr_0.8fr] border-t border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
                        <span className="text-slate-100">{name}</span>
                        <span className="text-slate-400">{role}</span>
                        <span className="text-slate-300">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">System health</h3>
                    <p className="mt-1 text-sm text-slate-400">High-level status across services and operations.</p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-blue-200" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Auth", "Healthy"],
                    ["Courses", "Healthy"],
                    ["Exams", "Warning"],
                    ["Payments", "Healthy"],
                  ].map(([name, state]) => (
                    <div key={name} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                      <p className="text-sm text-slate-400">{name}</p>
                      <div className="mt-2 text-lg font-semibold">{state}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">Quick actions</h3>
                <div className="mt-4 grid gap-3">
                  {[
                    "Manage users",
                    "Review academic settings",
                    "Open payment logs",
                    "View system alerts",
                  ].map((item) => (
                    <button key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/5">
                      <span>{item}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </section>
      </div>
    </main>
  );
}
