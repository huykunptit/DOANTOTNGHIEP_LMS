export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%)]" />
        <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="hidden border-r border-white/10 px-10 py-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-200/80">ERIPT LMS</p>
              <h1 className="mt-4 max-w-xl text-5xl font-semibold tracking-tight">
                A focused learning workspace for students, teachers, and admins.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
                Clean access flows with role-based experiences, built for a modern university LMS.
              </p>
            </div>

            <div className="grid max-w-xl gap-4">
              {[
                ["Role aware", "Separate flows for each role with a consistent interface."],
                ["Fast sign in", "Minimal friction with Google sign in and recovery flows."],
                ["Secure by default", "Ready for token-based auth and protected routing."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="text-sm font-medium text-white">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex items-center justify-center px-6 py-10 lg:px-10">
            <div className="w-full max-w-md">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
