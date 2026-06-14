import Link from "next/link";
import {
  ArrowRight, BookOpen, GraduationCap, ShieldCheck, Sparkles, Users,
} from "lucide-react";

const stats = [
  { label: "Người học đang hoạt động", value: "12k+" },
  { label: "Khóa học đã xuất bản", value: "240" },
  { label: "Tỉ lệ hoàn thành", value: "91%" },
];

const features = [
  {
    icon: BookOpen,
    title: "Học tập trực quan",
    description: "Duyệt, đăng ký và tiếp tục học mà không gặp bất kỳ trở ngại nào.",
  },
  {
    icon: ShieldCheck,
    title: "Phân quyền theo vai trò",
    description: "Luồng riêng biệt cho sinh viên, giảng viên và quản trị viên.",
  },
  {
    icon: Sparkles,
    title: "Giao diện tập trung",
    description: "UI hiện đại, phân cấp rõ ràng, phù hợp với môi trường học thuật.",
  },
];

const categories = [
  "Khoa học máy tính",
  "Kỹ thuật phần mềm",
  "Quản trị kinh doanh",
  "Ngôn ngữ",
  "Thiết kế",
  "Công nghệ thông tin",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      {/* Header */}
      <header className="border-b border-[#B3CCBC] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D5C31] text-base font-bold text-white">
              E
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">PTIT</p>
              <p className="text-sm font-bold text-[#0A1F12] leading-none">ERIPT LMS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/courses"
              className="hidden sm:inline-flex h-9 items-center px-3 text-sm font-medium text-[#3E5448] transition hover:text-[#166534]"
            >
              Khóa học
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg border border-[#B3CCBC] bg-white px-4 text-sm font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-lg bg-[#166534] px-4 text-sm font-semibold text-white transition hover:bg-[#0D5C31]"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#B3CCBC] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#B3CCBC] bg-[#EEF7F2] px-4 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-[#166534]">
                <GraduationCap className="h-4 w-4" />
                Hệ thống học tập đại học
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#0A1F12] sm:text-5xl">
                Một nền tảng cho<br />
                học tập, giảng dạy<br />
                và quản trị.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-7 text-[#3E5448]">
                Trải nghiệm LMS hiện đại với dashboard theo vai trò, quản lý khóa học, quiz tự động chấm và vận hành học thuật trong một hệ thống.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#166534] px-6 text-base font-semibold text-white transition hover:bg-[#0D5C31]"
                >
                  Vào hệ thống <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex h-12 items-center rounded-xl border border-[#B3CCBC] bg-white px-6 text-base font-semibold text-[#166534] transition hover:bg-[#EEF7F2]"
                >
                  Xem khóa học
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#B3CCBC] bg-white p-4 text-center shadow-[0_2px_8px_rgba(13,92,49,0.06)]">
                    <div className="text-2xl font-bold text-[#0D5C31]">{item.value}</div>
                    <div className="mt-1 text-xs text-[#6C8572] leading-4">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature card */}
            <div className="space-y-4 rounded-2xl border border-[#B3CCBC] bg-[#EEF7F2] p-5 lg:p-6">
              <div className="rounded-xl border border-[#B3CCBC] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#6C8572]">Tính năng nổi bật</p>
                <h2 className="mt-2 text-lg font-bold text-[#0A1F12]">
                  Dashboard vận hành học tập
                </h2>
                <p className="mt-1 text-sm text-[#3E5448]">
                  Theo dõi tiến độ, quản lý người dùng và duy trì luồng học thuật rõ ràng.
                </p>
              </div>

              <div className="space-y-3">
                {features.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-xl border border-[#B3CCBC] bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F2]">
                        <Icon className="h-5 w-5 text-[#166534]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0A1F12]">{item.title}</p>
                        <p className="mt-0.5 text-xs text-[#6C8572]">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-[#B3CCBC] bg-white p-4">
                <p className="text-sm font-semibold text-[#0A1F12]">Danh mục khóa học</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href="/courses"
                      className="rounded-full bg-[#E2F1E9] px-3 py-1 text-xs font-medium text-[#166534] transition hover:bg-[#D5EADE]"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles section */}
      <section className="border-b border-[#B3CCBC]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-[#0A1F12]">Dành cho mọi vai trò</h2>
          <p className="mt-3 text-center text-sm text-[#6C8572]">Mỗi nhóm người dùng có giao diện và tính năng riêng biệt.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                role: "Sinh viên",
                color: "#EEF7F2",
                desc: "Đăng ký khóa học, học bài theo tiến độ, làm quiz, xem bảng điểm và đặt câu hỏi cho giảng viên.",
              },
              {
                icon: BookOpen,
                role: "Giảng viên",
                color: "#EFF6FF",
                desc: "Tạo và quản lý khóa học, thêm bài giảng, xây dựng quiz, chấm bài tập và theo dõi học viên.",
              },
              {
                icon: ShieldCheck,
                role: "Quản trị viên",
                color: "#FEF3C7",
                desc: "Quản lý toàn bộ người dùng, giám sát hoạt động hệ thống, xem báo cáo doanh thu và vận hành học thuật.",
              },
            ].map(({ icon: Icon, role, color, desc }) => (
              <div key={role} className="rounded-2xl border border-[#B3CCBC] bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: color }}>
                  <Icon className="h-6 w-6 text-[#166534]" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#0A1F12]">{role}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6C8572]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-[#0D5C31]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white">Bắt đầu hành trình học tập ngay hôm nay</h2>
          <p className="mt-3 text-sm text-white/75">Đăng ký miễn phí, không cần thẻ tín dụng.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#0D5C31] transition hover:bg-[#EEF7F2]"
            >
              Đăng ký miễn phí <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Xem khóa học
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#B3CCBC] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 text-xs text-[#6C8572]">
          <span>© 2026 ERIPT LMS — PTIT</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[#166534]">Đăng nhập</Link>
            <Link href="/register" className="hover:text-[#166534]">Đăng ký</Link>
            <Link href="/courses" className="hover:text-[#166534]">Khóa học</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
