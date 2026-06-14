export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#F7FAF8]">
      {/* Mobile brand header — only on small screens */}
      <div className="flex items-center gap-3 bg-[#0D5C31] px-4 py-3 lg:hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-sm font-bold text-white">
          E
        </div>
        <span className="text-sm font-semibold tracking-wide text-white">ERIPT LMS</span>
      </div>

      <div className="grid min-h-[calc(100vh-3rem)] lg:min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel — desktop only */}
        <aside className="hidden bg-[#0D5C31] px-10 py-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white">
                E
              </div>
              <span className="text-lg font-semibold tracking-wide text-white">ERIPT LMS</span>
            </div>
            <h1 className="mt-12 max-w-xl text-4xl font-bold leading-tight tracking-tight text-white">
              Không gian học tập<br />tập trung cho đại học
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
              Trải nghiệm riêng biệt cho sinh viên, giảng viên và quản trị viên — trên một nền tảng thống nhất.
            </p>
          </div>

          <div className="grid max-w-xl gap-4">
            {[
              ["Phân quyền theo vai trò", "Giao diện riêng cho từng nhóm người dùng, nhất quán và rõ ràng."],
              ["Đăng nhập nhanh", "Hỗ trợ Google Sign-In và quy trình khôi phục đơn giản."],
              ["Bảo mật mặc định", "Xác thực token, routing bảo vệ và phiên làm việc an toàn."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                <div className="text-sm font-semibold text-white">{title}</div>
                <p className="mt-1.5 text-sm leading-6 text-white/65">{desc}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Form area */}
        <section className="flex items-start justify-center bg-[#F7FAF8] px-4 py-6 sm:items-center sm:px-6 sm:py-10 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
