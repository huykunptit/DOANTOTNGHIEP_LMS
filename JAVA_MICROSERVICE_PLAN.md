# ERIPT LMS — Java Microservice Rewrite Plan

## 1. Phân tích project hiện tại

### Stack hiện tại
| Layer | Công nghệ |
|---|---|
| Backend | Laravel 11 (PHP) — monolith |
| Frontend | Nuxt.js 3 (Vue 3 + TypeScript) |
| AI Service | Python FastAPI |
| Mobile | Flutter |
| DB | MySQL, Redis, MongoDB |
| Storage | MinIO (S3-compatible) |
| Infra | Docker + Docker Compose, Nginx |

### Các domain chính (từ Models + Routes)
Đây là nền tảng để phân chia microservice:

| Domain | Models chính |
|---|---|
| Auth / User | User, Role, Permission |
| Course | Course, Section, Lesson, LessonProgress, LessonNote, LessonAttachment, Review, CourseQa, VirtualClass, Assignment, ScormPackage |
| Exam / Quiz | QuestionBank, Question, Quiz, Exam, QuizAttempt, ExamEnrollment, ExamViolation |
| Payment | Order |
| Academic (PTIT) | AcademicYear, Term, Program, Specialization, Major, Cohort, Curriculum, CurriculumCourse, AdministrativeClass, ClassSection, GradeComponent, GradeEntry, Certificate |
| AI | AiSetting, AiRequestLog, CareerRecommendation, UserCV, JobPosting, Skill |
| Notification | Notification |

---

## 13. Frontend Migration: Nuxt.js → Next.js

### Tại sao chuyển sang Next.js
- React ecosystem lớn hơn, tài liệu học nhiều hơn (cùng học Java + React = full-stack hiện đại)
- App Router của Next.js 15 gần giống file-routing của Nuxt → học curve thấp
- SSR/SSG/ISR tốt hơn Nuxt với React Server Components
- Tích hợp tốt hơn với shadcn/ui, TanStack Query — 2 thư viện rất phổ biến trong React ecosystem
- `next-auth` v5 cho auth flow chuẩn hơn

---

### Phân tích frontend hiện tại (Nuxt)

| Thống kê | Số lượng |
|---|---|
| Pages (`.vue`) | 97 trang |
| Components | ~65 components |
| Layouts | 5 (`default`, `auth`, `admin`, `instructor`, `student`) |
| Pinia Stores | 2 (`auth`, `course`) |
| Composables | 8 (`useApi`, `useAuthSession`, `useAdminToast`, ...) |
| Middleware | 3 (`auth`, `admin`, `instructor`) |

**Dependencies cần migrate:**
| Nuxt/Vue | Next.js/React tương đương |
|---|---|
| `nuxt` | `next` |
| `vue` | `react` |
| `pinia` | `zustand` |
| `vue-router` | Next.js App Router (built-in) |
| `$fetch` (ofetch) | `fetch` + **TanStack Query** |
| `@tiptap/vue-3` | `@tiptap/react` (cùng tác giả, đổi adapter) |
| `@nuxtjs/tailwindcss` | `tailwindcss` (config trực tiếp) |
| `useRuntimeConfig()` | `process.env` / `NEXT_PUBLIC_*` |
| Nuxt plugins | Next.js Providers trong `layout.tsx` |

---

### Mapping cấu trúc thư mục

```
Nuxt (cũ)                           Next.js (mới)
─────────────────────────────────   ─────────────────────────────────
app.vue                          →  app/layout.tsx           (root layout)
app/pages/index.vue              →  app/page.tsx
app/pages/login.vue              →  app/(auth)/login/page.tsx
app/pages/register.vue           →  app/(auth)/register/page.tsx
app/pages/dashboard.vue          →  app/(main)/dashboard/page.tsx
app/pages/courses/index.vue      →  app/(main)/courses/page.tsx
app/pages/courses/[id]/index.vue →  app/(main)/courses/[id]/page.tsx
app/pages/learn/[cId]/[lId].vue  →  app/(main)/learn/[courseId]/[lessonId]/page.tsx
app/pages/admin/index.vue        →  app/(admin)/admin/page.tsx
app/pages/admin/users.vue        →  app/(admin)/admin/users/page.tsx

app/layouts/default.vue          →  app/(main)/layout.tsx
app/layouts/auth.vue             →  app/(auth)/layout.tsx
app/layouts/admin.vue            →  app/(admin)/layout.tsx
app/layouts/instructor.vue       →  app/(instructor)/layout.tsx
app/layouts/student.vue          →  app/(student)/layout.tsx

app/components/                  →  components/
app/composables/useXxx.ts        →  hooks/useXxx.ts
app/stores/auth.ts  (Pinia)      →  stores/auth.ts  (Zustand)
app/stores/course.ts (Pinia)     →  stores/course.ts (Zustand)
app/middleware/auth.ts           →  middleware.ts   (Next.js root middleware)
app/middleware/admin.ts          →  middleware.ts   (cùng file, if/else theo role)
app/constants/                   →  lib/constants/
app/assets/css/main.css          →  app/globals.css
nuxt.config.ts                   →  next.config.ts
```

---

### Tech Stack Next.js

```
next.js-frontend/
├── package.json
└── Tech stack:
    ├── Next.js 15          (App Router, React Server Components)
    ├── React 19
    ├── TypeScript
    ├── Tailwind CSS 4
    ├── shadcn/ui           (component library — thay thế các UiXxx.vue custom)
    ├── Zustand             (state management — thay Pinia)
    ├── TanStack Query v5   (data fetching, caching, invalidation)
    ├── @tiptap/react       (rich text editor — cùng API, đổi adapter)
    ├── next-auth v5        (auth session — hoặc custom JWT hook)
    ├── axios               (HTTP client — tùy chọn, có thể dùng fetch thuần)
    └── recharts            (charts — thay thế chart components Vue)
```

---

### Cấu trúc thư mục Next.js

```
nextjs-frontend/
├── app/
│   ├── layout.tsx                  # Root layout (font, providers)
│   ├── globals.css
│   ├── page.tsx                    # Landing page (/)
│   │
│   ├── (auth)/                     # Route group — layout auth (centered card)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   │
│   ├── (main)/                     # Route group — layout public/student
│   │   ├── layout.tsx              # Header + Footer
│   │   ├── dashboard/page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── edit/page.tsx
│   │   │       └── lessons/page.tsx
│   │   ├── learn/[courseId]/
│   │   │   ├── page.tsx
│   │   │   └── [lessonId]/page.tsx
│   │   ├── my-courses/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── exam/[examId]/page.tsx
│   │   └── career/page.tsx
│   │
│   ├── (admin)/                    # Route group — layout admin sidebar
│   │   ├── layout.tsx              # AdminSidebar + AdminTopbar
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── users/page.tsx
│   │       ├── courses/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── academic/
│   │       │   ├── page.tsx
│   │       │   ├── programs/page.tsx
│   │       │   ├── curricula/
│   │       │   │   ├── page.tsx
│   │       │   │   └── [id]/page.tsx
│   │       │   └── ...
│   │       ├── exam-monitor/page.tsx
│   │       └── reports/
│   │           └── ...
│   │
│   └── (instructor)/               # Route group — instructor dashboard
│       ├── layout.tsx
│       └── instructor/
│           └── ...
│
├── components/
│   ├── ui/                         # shadcn/ui components (auto-generated)
│   ├── common/                     # AppHeader, AppFooter
│   ├── auth/                       # LoginForm, RegisterForm...
│   ├── course/                     # CourseCard, CurriculumStudio...
│   ├── dashboard/                  # Charts, StatsCard...
│   ├── exam/                       # StudentQuiz, ExamProctor...
│   └── ...
│
├── hooks/                          # Custom React hooks (thay composables)
│   ├── useApi.ts                   # fetch wrapper với auth header
│   ├── useAuthSession.ts
│   ├── useAdminToast.ts
│   └── ...
│
├── stores/                         # Zustand stores (thay Pinia)
│   ├── auth.ts
│   └── course.ts
│
├── lib/
│   ├── api/                        # API call functions (dùng với TanStack Query)
│   │   ├── auth.api.ts
│   │   ├── course.api.ts
│   │   ├── exam.api.ts
│   │   └── ...
│   ├── constants/
│   └── utils.ts                    # cn() helper cho tailwind class merge
│
├── middleware.ts                   # Next.js route middleware (auth guard)
├── next.config.ts
└── tailwind.config.ts
```

---

### Chi tiết migrate từng phần

#### A. Pinia Store → Zustand

```typescript
// Nuxt — stores/auth.ts (Pinia)
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: null }),
  actions: {
    setUser(user) { this.user = user }
  }
})

// Next.js — stores/auth.ts (Zustand)
interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }  // persist to localStorage
  )
)
```

#### B. Composable `useApi` → Custom Hook + TanStack Query

```typescript
// hooks/useApi.ts — wrapper thuần (dùng trong TanStack Query queryFn)
export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const token = options.token ?? useAuthStore.getState().token
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// Dùng với TanStack Query:
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => apiRequest<Course[]>('/courses'),
  })
}
```

#### C. Nuxt Middleware → Next.js `middleware.ts`

```typescript
// middleware.ts (root — chạy trước mọi route)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const { pathname } = request.nextUrl

  // Auth guard
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/learn')) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin guard
  if (pathname.startsWith('/admin')) {
    const role = getRoleFromToken(token)  // decode JWT client-side
    if (role !== 'admin') return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/learn/:path*', '/instructor/:path*'],
}
```

#### D. Nuxt Layout → Next.js Route Groups

```tsx
// Nuxt: definePageMeta({ layout: 'admin' }) trong mỗi page
// Next.js: app/(admin)/layout.tsx tự động apply cho tất cả pages bên trong

// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

#### E. Tiptap (đổi adapter, giữ nguyên extensions)

```typescript
// Nuxt — @tiptap/vue-3
import { useEditor, EditorContent } from '@tiptap/vue-3'

// Next.js — @tiptap/react (cùng API)
import { useEditor, EditorContent } from '@tiptap/react'
// Extensions giữ nguyên 100%, chỉ đổi import adapter
```

---

### Danh sách pages cần migrate (97 trang → 97 routes)

| Route group | Số trang | Pages chính |
|---|---|---|
| `(auth)` | 6 | login, register, forgot-password, reset-password, verify-email, auth/google |
| `(main)` public | 12 | index, courses, courses/[id], learn, checkout, career, categories, certificates... |
| `(main)` student | 8 | dashboard, my-courses, my-certificates, orders, profile, me/dashboard, me/transcript, exam/[id] |
| `(admin)` | 45 | Toàn bộ `/admin/**` |
| `(instructor)` | 20 | Toàn bộ `/instructor/**` |
| misc | 6 | advisor, student/*, payment/* |

---

### Phase convert (gắn với Java phases)

| Phase | Nội dung |
|---|---|
| **Phase 1** | Setup Next.js project, cấu hình Tailwind + shadcn/ui, Zustand, TanStack Query. Migrate auth pages + layout auth. Kết nối Auth Service Java. |
| **Phase 2** | Migrate layout `(main)` + `(admin)` skeleton. Course list, course detail, learn page. |
| **Phase 3** | Admin pages (users, courses, academic). Instructor pages. |
| **Phase 4** | Exam flow (quiz, exam-monitor, proctoring). Payment flow (checkout, PayOS callback). |
| **Phase 5** | Academic pages (curricula, gradebook, transcript). Notification bell. |
| **Phase 6** | AI Chatbot, Career Advisor. Charts (recharts). Polish + responsive. |

---

### Cập nhật Docker Compose

```yaml
# Thay thế service frontend Nuxt bằng Next.js
frontend:
  build:
    context: ./nextjs-frontend
    dockerfile: Dockerfile
  container_name: lms_frontend
  environment:
    NEXT_PUBLIC_API_BASE: /api
    NODE_ENV: production
  ports:
    - "3000:3000"
  networks:
    - lms_network
```

**Dockerfile Next.js (standalone output):**
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

### Tóm tắt so sánh Frontend

| | Nuxt.js (cũ) | Next.js (mới) |
|---|---|---|
| Framework | Nuxt 4 (Vue 3) | Next.js 15 (React 19) |
| State | Pinia | Zustand |
| Data fetching | `$fetch` (ofetch) | TanStack Query v5 |
| Components | Tự viết UiXxx.vue | shadcn/ui |
| Rich text | `@tiptap/vue-3` | `@tiptap/react` |
| Auth guard | Nuxt middleware | `middleware.ts` |
| Routing | `pages/*.vue` | `app/**/page.tsx` (App Router) |
| Layouts | `layouts/*.vue` | Route groups `(group)/layout.tsx` |
| Charts | Custom Vue chart wrappers | recharts |
| Build output | `.output/` | `.next/standalone` |

---

## 2. Kiến trúc Microservice đề xuất

```
                         ┌──────────────────────────────────────┐
  Flutter App            │           API Gateway (8080)          │
  Nuxt.js Frontend  ───► │     Spring Cloud Gateway               │
                         │  - JWT validation filter               │
                         │  - Rate limiting                       │
                         │  - Route → services                    │
                         └───────────────┬──────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
    ┌─────▼──────┐  ┌────────────┐  ┌───▼────────┐  ┌──────────────┐  ┌──────────────┐
    │Auth Service│  │Course Svc  │  │Exam Service│  │Payment Svc   │  │Academic Svc  │
    │  :8081     │  │  :8082     │  │  :8083     │  │  :8084       │  │  :8085       │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘
          │               │               │                 │                 │
          └───────────────┴───────────────┴─────────────────┴─────────────────┘
                                          │
                        ┌─────────────────┼───────────────────┐
                        │                 │                   │
                  ┌─────▼─────┐    ┌──────▼──────┐   ┌───────▼──────┐
                  │Notif. Svc │    │  AI Service  │   │ Media Service│
                  │  :8086    │    │  :8087 (Py)  │   │  :8088       │
                  └─────┬─────┘    └─────────────┘   └──────────────┘
                        │
                  ┌─────▼──────────────────────────────────────┐
                  │            Message Bus (RabbitMQ)           │
                  └─────────────────────────────────────────────┘
```

---

## 3. Chi tiết từng Microservice

### 3.1 API Gateway
**Port:** 8080  
**Framework:** Spring Cloud Gateway  

**Trách nhiệm:**
- Route request tới đúng service
- Validate JWT token (stateless, không cần gọi Auth Service mỗi request)
- Rate limiting per user/IP
- CORS global
- Request logging

**Không làm:**
- Business logic
- Trực tiếp truy cập DB

---

### 3.2 Auth Service
**Port:** 8081  
**DB:** MySQL schema `auth_db`  

**Trách nhiệm:**
- Đăng ký, đăng nhập, đăng xuất
- JWT access token + refresh token (lưu refresh token trong Redis với TTL)
- OAuth2 Google login
- Quên mật khẩu, xác thực email
- CRUD users (admin)
- Quản lý roles & permissions
- Publish event `UserCreated`, `UserUpdated` → RabbitMQ

**Tables:** `users`, `roles`, `permissions`, `role_user`, `permission_role`, `refresh_tokens`

**API tiêu biểu:**
```
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/google/callback
PUT  /auth/me/profile
PUT  /auth/me/password
```

---

### 3.3 Course Service
**Port:** 8082  
**DB:** MySQL schema `course_db` + MongoDB collection `lesson_contents`  

**Trách nhiệm:**
- CRUD Categories, Courses, Sections, Lessons
- Upload video → gọi Media Service
- Lesson progress tracking
- Lesson notes, attachments
- Course reviews & ratings
- Q&A (hỏi đáp trong khóa học)
- Virtual class links
- Assignment & submissions
- SCORM/H5P packages
- Course approval workflow

**Tables:** `categories`, `courses`, `sections`, `lessons`, `lesson_progress`, `lesson_notes`, `lesson_attachments`, `reviews`, `course_qas`, `course_qa_replies`, `qa_reactions`, `virtual_classes`, `lesson_assignments`, `user_assignments`, `scorm_packages`  
**MongoDB:** `lesson_content` (rich text, video metadata)

**Consume events:** `EnrollmentCreated` (để check quyền truy cập lesson)

---

### 3.4 Exam Service
**Port:** 8083  
**DB:** MySQL schema `exam_db`  

**Trách nhiệm:**
- CRUD Question Banks, Question Groups, Questions, Answers
- Upload file đính kèm câu hỏi → Media Service
- CRUD Quizzes (gắn vào lesson)
- CRUD Exams (standalone và trong khóa học)
- Quiz/Exam taking: start, auto-save, submit
- Exam enrollment management
- Live proctoring: pause, resume, force-stop, extend-time, log violations
- Kết quả thi, review đáp án

**Tables:** `question_banks`, `question_groups`, `questions`, `answers`, `question_attachments`, `quizzes`, `quiz_questions`, `quiz_answers`, `exams`, `exam_enrollments`, `quiz_attempts`, `exam_violations`, `grade_components`, `grade_entries`

**Realtime:** WebSocket `/ws/exam/{examId}/monitor` cho live proctoring dashboard

---

### 3.5 Payment Service
**Port:** 8084  
**DB:** MySQL schema `payment_db`  

**Trách nhiệm:**
- Tạo đơn hàng, quản lý orders
- Tích hợp PayOS (webhook xác nhận thanh toán)
- Xác thực webhook signature
- Publish event `PaymentSuccess` → RabbitMQ

**Tables:** `orders`, `order_items`, `payment_transactions`

**Consume events:** _(không)_  
**Publish events:** `PaymentSuccess { userId, courseIds, orderId }`

---

### 3.6 Academic Service
**Port:** 8085  
**DB:** MySQL schema `academic_db`  

**Trách nhiệm (PTIT-specific):**
- Quản lý AcademicYear, Term, Program, Specialization, Major
- Quản lý Cohort (khóa học sinh), AdministrativeClass
- CRUD Curriculum (chương trình học) + CurriculumCourse
- Import curriculum từ JSON
- ClassSection management
- Enrollment management (ghi danh vào lớp)
- Gradebook (điểm số per section)
- Student transcript
- Certificate templates & issuance
- Advisor dashboard (học viên có nguy cơ)
- Student dashboard, Instructor dashboard

**Tables:** `academic_years`, `terms`, `programs`, `specializations`, `majors`, `cohorts`, `administrative_classes`, `curricula`, `curriculum_courses`, `class_sections`, `enrollments`, `certificate_templates`, `user_certificates`, `institutions`, `positions`

**Consume events:** `PaymentSuccess` → tạo enrollment, `UserCreated` → sync student profile

---

### 3.7 Notification Service
**Port:** 8086  
**DB:** MongoDB collection `notifications` + Redis (unread count cache)  

**Trách nhiệm:**
- Nhận events từ các service khác qua RabbitMQ
- Lưu notifications vào MongoDB
- REST API: GET list, mark read, mark all read, unread count
- (Tương lai) WebSocket push realtime

**Consume events:** `PaymentSuccess`, `EnrollmentCreated`, `ExamStarted`, `GradePublished`, etc.

---

### 3.8 AI Service
**Port:** 8087  
**Giữ nguyên Python FastAPI** (không cần rewrite, giao tiếp qua HTTP)  

**Trách nhiệm:**
- AI Chat (gọi OpenAI/GPT)
- Career Advisor (phân tích CV, recommend jobs)
- Content generation

**Nếu muốn thuần Java:** thay bằng Spring Boot + Spring AI library + OpenAI SDK.

---

### 3.9 Media Service
**Port:** 8088  
**DB:** MySQL schema `media_db`  

**Trách nhiệm:**
- Upload file lên MinIO
- Presigned URL cho video streaming
- File metadata management
- Soft delete / cleanup

**Tables:** `media_files`

---

## 4. Tech Stack Java

### Core
| Thư viện | Mục đích |
|---|---|
| **Java 21** | LTS, Virtual Threads (Project Loom) |
| **Spring Boot 3.3.x** | Framework chính |
| **Spring Security 6** | Auth, JWT filter |
| **Spring Data JPA + Hibernate 6** | ORM |
| **Spring Data MongoDB** | MongoDB repos |
| **Spring Data Redis** | Cache, rate limit, refresh tokens |
| **Spring Cloud Gateway** | API Gateway |
| **Spring AMQP (RabbitMQ)** | Message bus |
| **Spring WebSocket** | Realtime proctoring |

### Build & Code Quality
| Thư viện | Mục đích |
|---|---|
| **Gradle (Kotlin DSL)** | Build tool, cleaner than Maven |
| **Lombok** | Giảm boilerplate (getter/setter/builder) |
| **MapStruct** | DTO ↔ Entity mapping, không dùng tay |
| **Flyway** | Database migration (thay vì ORM auto-schema) |
| **springdoc-openapi 2** | Swagger UI tự động từ annotations |
| **jjwt (io.jsonwebtoken)** | JWT library |

### Testing
| Thư viện | Mục đích |
|---|---|
| **JUnit 5** | Unit tests |
| **Mockito** | Mocking |
| **Testcontainers** | Integration tests với real DB/Redis |
| **Spring Boot Test** | @SpringBootTest, MockMvc |

### Observability
| Thư viện | Mục đích |
|---|---|
| **Spring Actuator** | Health check, metrics endpoint |
| **Micrometer + Prometheus** | Metrics scraping |

---

## 5. Cấu trúc thư mục (monorepo)

```
eript-lms-java/
├── docker-compose.yml              # Infra + tất cả services
├── docker-compose.dev.yml          # Override cho dev (hot reload)
├── .env.example
│
├── api-gateway/                    # Spring Cloud Gateway
│   ├── src/
│   ├── Dockerfile
│   └── build.gradle.kts
│
├── auth-service/
│   ├── src/
│   │   └── main/java/com/eript/auth/
│   │       ├── config/             # SecurityConfig, JwtConfig, RabbitConfig
│   │       ├── controller/         # AuthController, UserController, AdminController
│   │       ├── service/            # AuthService, UserService, TokenService
│   │       ├── repository/         # UserRepository, RoleRepository
│   │       ├── entity/             # User, Role, Permission (JPA entities)
│   │       ├── dto/                # LoginRequest, RegisterRequest, UserResponse...
│   │       ├── event/              # UserCreatedEvent (publish to RabbitMQ)
│   │       └── exception/          # GlobalExceptionHandler
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/           # Flyway scripts: V1__init.sql
│   ├── Dockerfile
│   └── build.gradle.kts
│
├── course-service/
├── exam-service/
├── payment-service/
├── academic-service/
├── notification-service/
├── media-service/
│
├── ai-service/                     # Giữ nguyên Python FastAPI
│
├── frontend/                       # Nuxt.js (giữ nguyên hoặc migrate)
├── flutter_application_1/          # Flutter mobile
│
└── docker/
    ├── nginx/
    │   └── default.conf
    └── rabbitmq/
        └── rabbitmq.conf
```

### Cấu trúc package chuẩn mỗi service
```
com.eript.{service}/
├── config/         # Spring beans, security, messaging config
├── controller/     # REST controllers (@RestController)
├── service/        # Business logic interface + impl
├── repository/     # Spring Data repos (JPA / Mongo)
├── entity/         # JPA @Entity classes
├── dto/            # Request/Response DTOs (records hoặc classes)
├── mapper/         # MapStruct interfaces
├── event/          # AMQP event publishers & listeners
├── exception/      # Custom exceptions + @ControllerAdvice handler
└── util/           # Helpers
```

---

## 6. Database Strategy

### Mỗi service có schema riêng (Database per Service)
```
MySQL:
  ├── auth_db         ← Auth Service
  ├── course_db       ← Course Service
  ├── exam_db         ← Exam Service
  ├── payment_db      ← Payment Service
  ├── academic_db     ← Academic Service
  └── media_db        ← Media Service

MongoDB:
  ├── notifications   ← Notification Service
  └── lesson_contents ← Course Service (rich lesson data)

Redis:
  ├── refresh_tokens  ← Auth Service (TTL-based)
  ├── rate_limits     ← API Gateway
  └── unread_count    ← Notification Service (cache)
```

### Không dùng cross-service JOINs
- Mỗi service chỉ truy cập schema của mình
- Dữ liệu cần từ service khác → gọi qua REST hoặc lắng nghe event
- Denormalize khi cần thiết (ví dụ: lưu `instructor_name` vào course_db thay vì JOIN sang auth_db)

---

## 7. Communication Patterns

### Sync (REST)
- Client → API Gateway → Service
- Service A gọi Service B khi cần data realtime (ví dụ: Course Service gọi Auth Service để lấy instructor info khi tạo course)
- Dùng **Spring's RestClient** (Java 21+) hoặc **OpenFeign** cho inter-service HTTP calls

### Async (RabbitMQ Events)
| Event | Publisher | Consumers |
|---|---|---|
| `UserCreated` | Auth Service | Academic Service |
| `PaymentSuccess` | Payment Service | Academic Service, Notification Service |
| `EnrollmentCreated` | Academic Service | Course Service, Notification Service |
| `GradePublished` | Academic Service | Notification Service |
| `ExamSubmitted` | Exam Service | Notification Service |
| `CourseApproved` | Course Service | Notification Service |

---

## 8. Docker Compose (infrastructure + services)

```yaml
# Tất cả chạy trong network lms_network
services:
  # ── Infrastructure ──
  mysql:        image: mysql:8.0
  redis:        image: redis:7-alpine
  mongodb:      image: mongo:7
  minio:        image: minio/minio
  rabbitmq:     image: rabbitmq:3-management  # ← mới thêm
  nginx:        image: nginx:alpine

  # ── Java Services ──
  api-gateway:        port 8080
  auth-service:       port 8081
  course-service:     port 8082
  exam-service:       port 8083
  payment-service:    port 8084
  academic-service:   port 8085
  notification-service: port 8086
  media-service:      port 8088

  # ── AI Service (Python) ──
  ai-service:         port 8087

  # ── Frontend ──
  frontend:           port 3000
```

---

## 9. JWT Strategy

```
Auth Service sinh JWT, nhúng claims:
{
  "sub": "userId",
  "roles": ["STUDENT"],
  "iat": ...,
  "exp": ... (15 phút)
}

API Gateway validate JWT bằng public key (RS256 hoặc shared secret HS256).
→ Không cần gọi Auth Service mỗi request.
→ Các service downstream trust claims từ Gateway forward qua header X-User-Id, X-User-Roles.
```

---

## 10. Kế hoạch thực hiện (Phases)

### Phase 1 — Foundation (1-2 tuần)
- [ ] Setup monorepo, Gradle multi-project build
- [ ] Viết `docker-compose.yml` với MySQL schemas, Redis, MongoDB, RabbitMQ, MinIO
- [ ] Implement **Auth Service** (register, login, JWT, refresh token, roles)
- [ ] Implement **API Gateway** (routing + JWT filter)
- [ ] Kết nối Flutter app với endpoint mới

### Phase 2 — Core Learning (2-3 tuần)
- [ ] **Course Service** (categories, courses, sections, lessons, progress, reviews)
- [ ] **Media Service** (MinIO upload, presigned URL cho video)
- [ ] **Academic Service** phần cơ bản (curricula, enrollments, class sections)

### Phase 3 — Exam & Payment (1-2 tuần)
- [ ] **Exam Service** (question bank, quiz, exam, proctoring)
- [ ] **Payment Service** (orders, PayOS webhook)

### Phase 4 — Async & Notifications (1 tuần)
- [ ] Setup RabbitMQ
- [ ] Implement events giữa các services
- [ ] **Notification Service**

### Phase 5 — Advanced Academic (1 tuần)
- [ ] Academic Service phần nâng cao (gradebook, transcript, certificates, advisor)

### Phase 6 — Polish (ongoing)
- [ ] API docs (Swagger per service)
- [ ] Integration tests với Testcontainers
- [ ] Observability (Actuator + Prometheus)
- [ ] Tối ưu N+1 queries

---

## 11. Điểm cần chú ý khi học Java qua project này

### Concepts sẽ thực hành được:
1. **Spring Security** — filter chain, JWT, method security (`@PreAuthorize`)
2. **Spring Data JPA** — relationships, lazy/eager loading, JPQL, N+1 fix với `@EntityGraph`
3. **Design Patterns** — Repository, Service Layer, Builder (Lombok), Strategy (payment providers)
4. **DTO pattern** — tách entity khỏi API contract, dùng MapStruct
5. **Exception Handling** — `@ControllerAdvice`, custom exceptions, RFC 7807 Problem Details
6. **Event-driven** — RabbitMQ publisher/consumer, idempotency
7. **Database migrations** — Flyway versioned scripts
8. **Testing** — Unit với Mockito, Integration với Testcontainers
9. **Async** — `@Async`, CompletableFuture cho parallel calls
10. **Virtual Threads (Java 21)** — throughput cao, replace traditional thread pool

---

## 12. Tóm tắt so sánh

| | Laravel (cũ) | Java Microservices (mới) |
|---|---|---|
| Kiến trúc | Monolith | 8 microservices |
| Language | PHP 8 | Java 21 |
| Framework | Laravel 11 | Spring Boot 3.3 |
| Auth | Sanctum | JWT (RS256) |
| Messaging | - | RabbitMQ |
| DB Migration | Artisan migrate | Flyway |
| API Docs | Postman collection | Swagger (springdoc) |
| Testing | PHPUnit | JUnit 5 + Testcontainers |
| Build | Composer | Gradle (Kotlin DSL) |
| Mobile | Flutter (giữ nguyên) | Flutter (giữ nguyên) |
| AI Service | Python FastAPI | Python FastAPI (giữ nguyên) |
