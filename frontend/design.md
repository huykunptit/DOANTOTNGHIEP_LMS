---
name: EduVerde Design System
colors:
  surface: '#ffffff'
  surface-dim: '#d0e9da'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef7f2'
  surface-container: '#e2f1e9'
  surface-container-high: '#d5eade'
  surface-container-highest: '#c7e3d4'
  on-surface: '#0a1f12'
  on-surface-variant: '#3e5448'
  inverse-surface: '#1c3527'
  inverse-on-surface: '#eef7f2'
  outline: '#6c8572'
  outline-variant: '#b3ccbc'
  surface-tint: '#166534'
  primary: '#0d5c31'
  on-primary: '#ffffff'
  primary-container: '#166534'
  on-primary-container: '#a7f3c0'
  inverse-primary: '#86efac'
  secondary: '#2d6a4c'
  on-secondary: '#ffffff'
  secondary-container: '#52c47e'
  on-secondary-container: '#0a2e1b'
  tertiary: '#3a5068'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b7d9a'
  on-tertiary-container: '#d9edf8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8f5d9'
  primary-fixed-dim: '#86efac'
  on-primary-fixed: '#001a0d'
  on-primary-fixed-variant: '#0d5c31'
  secondary-fixed: '#c8f0dc'
  secondary-fixed-dim: '#86d4a8'
  on-secondary-fixed: '#001a0d'
  on-secondary-fixed-variant: '#2d6a4c'
  tertiary-fixed: '#d4e8f7'
  tertiary-fixed-dim: '#9fc2da'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#3a5068'
  background: '#f7faf8'
  on-background: '#0a1f12'
  surface-variant: '#c7e3d4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  max-width: 1440px
---

## Brand & Style

EduVerde là design system cho hệ thống quản lý học tập (LMS) cấp đại học. Triết lý thiết kế hướng đến sự **rõ ràng, thoáng đãng và đáng tin cậy** — phản ánh môi trường học thuật nghiêm túc mà vẫn thân thiện, dễ tiếp cận.

Bản sắc thương hiệu được xây dựng trên **Forest Green** (#166534) — màu xanh lá đậm, truyền cảm giác phát triển, tri thức và bền vững. Màu nền **trắng sạch** tạo không gian tập trung cho nội dung học thuật. Không dùng gradient; chiều sâu được tạo bởi các lớp tông màu solid.

**Đối tượng:** Sinh viên (cần UI nhẹ nhàng, tập trung học tập), Giảng viên (cần thao tác nhanh, dữ liệu rõ), Quản trị viên (cần mật độ thông tin cao).

**Phong cách:** Clean Academic — tối giản nhưng không lạnh lùng. Khoảng trắng có chủ ý, không trang trí thừa.

## Colors

Bảng màu xây dựng quanh **Forest Green** (#166534) làm màu chính. **Không dùng gradient ở bất kỳ đâu**.

### Primary — Forest Green
- **Primary:** `#0D5C31` — Headings, sidebar nền, nút CTA chính.
- **Primary Container:** `#166534` — Hover state của nút chính, active sidebar item.
- **On-Primary:** `#FFFFFF` — Text trên nền primary.
- **On-Primary Container:** `#A7F3C0` — Icon/text trên primary-container.

### Secondary — Mid Green
- **Secondary:** `#2D6A4C` — Nút phụ, badge, progress bar.
- **On-Secondary:** `#FFFFFF`.

### Surface & Background
- **Background:** `#F7FAF8` — Nền toàn trang, rất nhạt tint xanh lá.
- **Surface:** `#FFFFFF` — Card, modal, input.
- **Surface Container Low:** `#EEF7F2` — Sidebar, panel phụ.
- **Surface Container:** `#E2F1E9` — Row hover, selected state.
- **Outline:** `#6C8572` — Border input mặc định.
- **Outline Variant:** `#B3CCBC` — Divider, border card.

### Semantic
- **Error:** `#BA1A1A` — Lỗi, cảnh báo nguy hiểm.
- **Success:** `#166534` (dùng primary) hoặc badge `bg-green-50 text-green-700`.
- **Warning:** `#B45309` (amber-700) với nền `#FEF3C7`.
- **Info:** `#1D4ED8` (blue-700) với nền `#EFF6FF`.

### Accessibility
Mọi tổ hợp text/background phải đạt tương phản tối thiểu **4.5:1** (WCAG AA).

| Foreground | Background | Ratio |
|---|---|---|
| `#0D5C31` on `#FFFFFF` | Heading trên trắng | ~8.5:1 ✓ |
| `#FFFFFF` on `#166534` | Text trên nút | ~7.2:1 ✓ |
| `#3E5448` on `#F7FAF8` | Body text | ~6.1:1 ✓ |

## Typography

Dùng **Inter** độc quyền — tối ưu cho màn hình, đặc biệt ở font size nhỏ trong bảng dữ liệu.

### Quy tắc dùng
- `headline-xl` (40px/700): Chỉ cho trang chào, landing page.
- `headline-lg` (32px/700): Tiêu đề dashboard lớn.
- `headline-md` (24px/600): Tiêu đề section, card header.
- `body-lg` (18px/400): Mô tả khóa học, nội dung dài.
- `body-md` (16px/400): Body text thông thường.
- `body-sm` (14px/400): Label phụ, metadata, caption.
- `label-md` (14px/600, 0.05em tracking): **Table header — BẮT BUỘC viết hoa**.
- `label-sm` (12px/500): Badge text, timestamp, tag.

### Hệ thống trọng số
- **700 (Bold):** Tiêu đề trang, tên khóa học.
- **600 (Semibold):** Nav item, button label, section heading.
- **500 (Medium):** Badge, chip, secondary label.
- **400 (Regular):** Body text, description, mô tả.

## Layout & Spacing

**Desktop** (>1024px): Sidebar cố định 260px + content area fluid, max 1440px.
**Tablet** (768–1024px): Sidebar thu gọn 72px icon-only + 12-column grid.
**Mobile** (<768px): Sidebar ẩn, bottom navigation bar 5 item, 1-column layout.

### Grid
- Desktop: 12 cột, gutter 24px, margin 40px mỗi bên.
- Mobile: 4 cột, gutter 16px, margin 16px mỗi bên.

### Spacing Scale (base 4px)
`4 → 8 → 12 → 16 → 24 → 32 → 40 → 48 → 64px`

- **Table row:** padding dọc 12px (admin), 20px (student).
- **Card:** padding 24px (desktop), 16px (mobile).
- **Button:** height 40px (md), 36px (sm), padding ngang 16px.
- **Input:** height 40px, padding ngang 12px.

## Elevation & Depth

Không dùng shadow nặng. Chiều sâu tạo bởi **tonal layers** — nền đậm hơn một tông.

1. **Base:** `#F7FAF8` — nền trang.
2. **Card:** `#FFFFFF` + border `1px solid #B3CCBC`.
3. **Floating** (dropdown, modal): `#FFFFFF` + `box-shadow: 0 4px 16px rgba(13, 92, 49, 0.08)`.
4. **Overlay** (drawer, toast): `rgba(10, 31, 18, 0.4)` backdrop.

## Shapes

- **Button & Input:** `0.5rem` (8px) border-radius.
- **Card & Modal:** `1rem` (16px) border-radius.
- **Badge & Chip:** `9999px` (pill) — phân biệt rõ với nút.
- **Avatar:** `9999px` (tròn hoàn toàn).
- **Sidebar active indicator:** `0` (sharp 4px bar bên trái).

## Components

### Sidebar Navigation (Desktop)
- **Background:** `#0D5C31` (Primary).
- **Logo area:** padding 24px, tên hệ thống font 600, màu trắng.
- **Nav item inactive:** `text-white/65`, icon 20px, padding 10px 16px, radius 8px.
- **Nav item active:** `bg-[#166534]`, `text-white`, icon 20px, 4px solid `#52C47E` bar bên trái.
- **Nav item hover:** `bg-white/10`.
- **Section label:** `label-sm`, `text-white/45`, uppercase, padding 8px 16px, margin-top 16px.
- **Footer:** border-top `border-white/15`, user info + sign out button.

### Bottom Navigation (Mobile)
- **Background:** `#FFFFFF`, border-top `1px solid #B3CCBC`.
- Tối đa 5 item, icon 22px + label `label-sm`.
- **Active:** icon `#166534`, label `text-primary`, dot indicator `#52C47E`.
- **Inactive:** `text-muted-foreground`.

### Cards
- Border: `1px solid #B3CCBC`.
- Background: `#FFFFFF`.
- Radius: `1rem`.
- Shadow: **không có** (flat, chỉ border).
- Hover: border đổi sang `#6C8572`.
- **Card Header:** background `#EEF7F2`, padding 16px 24px, `headline-md`, border-bottom.

### Tables (Data-Rich)
- **Header:** background `#EEF7F2`, `label-md` uppercase, padding 12px 16px, `text-[#3E5448]`.
- **Row:** border-bottom `1px solid #B3CCBC`, padding 12px 16px (admin), 20px 16px (student).
- **Zebra strip (admin only):** odd rows `#F7FAF8`.
- **Row hover:** `#E2F1E9`.
- **Sticky header** khi scroll.

### Buttons
- **Primary:** `bg-[#166534] text-white`, hover `bg-[#0D5C31]`, radius 8px, height 40px.
- **Secondary:** `bg-[#EEF7F2] text-[#166534] border border-[#2D6A4C]`, hover `bg-[#D5EAD E]`.
- **Ghost:** `bg-transparent text-[#166534] border border-[#B3CCBC]`, hover `bg-[#EEF7F2]`.
- **Danger:** `bg-[#BA1A1A] text-white`, hover `bg-[#93000A]`.
- **Disabled:** opacity 45%, cursor not-allowed.
- **Loading:** spinner thay thế label, không thay đổi kích thước.

### Input Fields
- **Default:** `bg-white border-[1px] border-[#6C8572]`, radius 8px, height 40px, padding 0 12px.
- **Focus:** border `#166534`, ring `3px solid rgba(22, 101, 52, 0.15)`.
- **Error:** border `#BA1A1A`, ring `3px solid rgba(186, 26, 26, 0.15)`.
- **Disabled:** background `#EEF7F2`, text `text-muted-foreground`.
- **Placeholder:** `#6C8572`.
- **Label:** `label-md` uppercase hoặc `body-sm font-medium`, margin-bottom 6px.

### Badges & Status Chips
Luôn dùng **pill** (radius 9999px), padding `2px 10px`, `label-sm`.

| Trạng thái | Background | Text |
|---|---|---|
| Active / Passed | `#DCFCE7` | `#166534` |
| Inactive / Draft | `#F1F5F9` | `#64748B` |
| Pending / In Progress | `#FEF3C7` | `#B45309` |
| Failed / Error | `#FEE2E2` | `#DC2626` |
| Info | `#EFF6FF` | `#1D4ED8` |

### Progress Bar
- Track: `#D5EADE` (surface-container-high), height 6px, radius pill.
- Fill: `#166534` (primary), solid color, **không gradient**.
- Với % text: `label-sm text-primary` bên cạnh.

### Tabs
- **Underline style:** border-bottom `2px solid transparent` mặc định.
- **Active:** border-bottom `2px solid #166534`, label font-weight 600, text `#166534`.
- **Hover:** border-bottom `2px solid #B3CCBC`.
- **Padding:** 12px 16px.

### Avatars
- Hình tròn, fallback dùng chữ cái đầu tên, background `#0D5C31`, text trắng.
- Kích thước: `sm` 28px, `md` 36px, `lg` 48px, `xl` 64px.

### Form Layout
- Grid 2 cột trên desktop, 1 cột trên mobile.
- Gap giữa các field: 20px.
- Section heading dùng `body-md font-semibold text-foreground` + divider bên dưới.
- Action buttons: căn phải, gap 12px giữa Cancel (ghost) và Submit (primary).

### Stat Cards (Dashboard)
- Background `#FFFFFF`, border `#B3CCBC`, radius 16px, padding 20px.
- Icon 20px màu `#166534` góc trên phải.
- Value: `headline-lg font-bold text-foreground`.
- Label: `body-sm text-muted-foreground`.
- Trend badge (nếu có): `+12%` dùng success badge, `-3%` dùng error badge.

### Empty States
- Icon SVG 48px, màu `#B3CCBC`.
- Heading `headline-md text-foreground`.
- Description `body-md text-muted-foreground`, max-width 360px, căn giữa.
- CTA primary button bên dưới.
- Căn giữa dọc/ngang trong container.

### Toast / Notifications
- Slide vào từ top-right (desktop), top-center (mobile).
- Max-width 380px, radius 12px, padding 14px 16px.
- **Success:** border-left `4px solid #166534`, icon `CheckCircle2`.
- **Error:** border-left `4px solid #BA1A1A`, icon `XCircle`.
- **Warning:** border-left `4px solid #B45309`, icon `AlertTriangle`.
- **Info:** border-left `4px solid #1D4ED8`, icon `Info`.
- Auto-dismiss sau 4s, có nút X.

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` | < 480px | 1 cột, bottom nav, full-width cards |
| `sm` | 480–767px | 1 cột, bottom nav, 2-col grid cho cards |
| `md` | 768–1023px | Sidebar icon-only 72px, 12-col grid |
| `lg` | 1024–1279px | Sidebar 260px, 12-col grid |
| `xl` | ≥ 1280px | Sidebar 260px, max-width 1440px |

### Mobile-Specific Rules
- Tất cả touch target tối thiểu **44×44px**.
- Sidebar chuyển thành bottom nav (5 icon).
- Bảng dữ liệu: horizontal scroll hoặc chuyển sang card list.
- Modal: chiếm toàn màn hình từ bottom (sheet pattern).
- Font tối thiểu **16px** trên input để tránh iOS zoom.

## Page Templates

### Dashboard (Admin/Instructor)
```
┌─ Sidebar 260px ─┬──────── Content ────────────────┐
│  Logo           │  [Header: title + action btn]    │
│  ─────────      │  ─────────────────────────────── │
│  Nav items      │  [KPI cards — 3 or 4 columns]    │
│                 │                                   │
│                 │  [Main panel]  [Side panel]       │
│                 │                                   │
│  ─────────      │  [Secondary table / list]         │
│  User + Logout  │                                   │
└─────────────────┴───────────────────────────────── ┘
```

### Course List / Catalog
```
[Page header: title + search + filter + CTA]
[Filter chips / tabs]
[Grid: 3 col desktop, 2 col tablet, 1 col mobile]
  [Card: thumbnail + badge + title + meta + CTA]
[Pagination]
```

### Form Pages (Create / Edit)
```
[Back link]
[Page title]
[Form — max-width 720px, centered]
  [Section heading]
  [Field grid 2-col]
  [Full-width textarea]
  [Toggle/Checkbox row]
[Action: Cancel | Submit]
```

### Detail Pages (Course, Student, etc.)
```
[Breadcrumb]
[Hero: title + meta + actions]
[Tab navigation]
[Tab content panel]
```

## Writing Style (UI Copy)

- **Tên màn hình:** Ngắn gọn, tiếng Việt, danh từ (không thêm "trang" vào heading).
- **Nút CTA:** Động từ + danh từ: "Tạo khóa học", "Nộp bài", "Xem kết quả".
- **Empty state:** Thân thiện, giải thích vì sao trống và gợi ý hành động.
- **Error message:** Rõ nguyên nhân + giải pháp cụ thể. Tránh "Lỗi hệ thống".
- **Loading state:** Hiển thị skeleton hoặc spinner, không để màn hình trắng.
