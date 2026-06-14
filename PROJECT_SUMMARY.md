# eRIPT LMS — Tổng Hợp Dự Án ĐATN

> **Stack**: Java 21 · Spring Boot 3.3 · Next.js 15 · Flutter 3.11 · MySQL 8.0 · Docker Compose  
> **Cập nhật**: 2026-06-13

---

## 1. Tính Năng Theo Vai Trò

### 👤 Khách (Chưa đăng nhập)

| Tính năng | Web | API | Mobile |
|-----------|:---:|:---:|:------:|
| Xem danh sách khóa học | ✅ | ✅ | ✅ |
| Tìm kiếm khóa học | ✅ | ✅ | ✅ |
| Xem chi tiết khóa học (syllabus) | ✅ | ✅ | ✅ |
| Đăng ký tài khoản | ✅ | ✅ | ✅ |
| Đăng nhập email/mật khẩu | ✅ | ✅ | ✅ |
| Quên mật khẩu (link qua email) | ✅ | ✅ | ✅ |
| Đặt lại mật khẩu | ✅ | ✅ | ✅ |
| Đăng nhập bằng Google OAuth | 🔧 cần key | 🔧 cần key | ❌ chưa làm |

---

### 🎓 Sinh Viên (Student)

| Tính năng | Web | API | Mobile |
|-----------|:---:|:---:|:------:|
| **Dashboard** (stats: enrolled, completed, in-progress) | ✅ | ✅ | ✅ |
| Xem danh sách khóa học đã đăng ký | ✅ | ✅ | ✅ |
| Đăng ký khóa học miễn phí | ✅ | ✅ | ✅ |
| Mua khóa học có phí (PayOS) | 🔧 cần key | ✅ | ❌ |
| Học bài (video/tài liệu) | ✅ | ✅ | ✅ |
| Sidebar danh sách lesson theo section | ✅ | ✅ | ✅ |
| Đánh dấu bài học hoàn thành | ✅ | ✅ | ✅ |
| Tiến độ học (progress bar) | ✅ | ✅ | ✅ |
| Điều hướng bài tiếp theo | ✅ | ✅ | ✅ |
| Làm bài kiểm tra (Quiz MCQ) | ✅ | ✅ | ✅ |
| Timer đếm ngược trong quiz | ✅ | — | ✅ |
| Xem kết quả Quiz (pass/fail/điểm) | ✅ | ✅ | ✅ |
| Xem lịch sử làm quiz | ✅ | ✅ | ❌ |
| Nộp bài tập | ✅ | ✅ | ❌ |
| Xem điểm bài tập | ✅ | ✅ | ✅ |
| Xem bảng điểm tổng kết | ✅ | ✅ | ✅ |
| Đặt câu hỏi Forum trong khóa học | ✅ | ✅ | ❌ |
| Xem thông báo (badge + dropdown/screen) | ✅ | ✅ | ✅ |
| Đánh dấu thông báo đã đọc | ✅ | ✅ | ✅ |
| Sửa hồ sơ cá nhân | ✅ | ✅ | ✅ |
| Đổi mật khẩu | ✅ | ✅ | ✅ |
| Xác thực email | ✅ | ✅ | ✅ |
| Đăng xuất tất cả thiết bị | ✅ | ✅ | ✅ |

---

### 👨‍🏫 Giảng Viên (Instructor)

| Tính năng | Web | API | Mobile |
|-----------|:---:|:---:|:------:|
| **Dashboard** (courses, students, pending grading) | ✅ | ✅ | ❌ |
| Xem danh sách khóa học của mình | ✅ | ✅ | ❌ |
| Tạo khóa học mới (form đầy đủ) | ✅ | ✅ | ❌ |
| Thêm/sửa Section | ✅ | ✅ | ❌ |
| Thêm/sửa Lesson (VIDEO, DOCUMENT) | ✅ | ✅ | ❌ |
| Upload video/tài liệu (MinIO) | 🔧 cần MinIO | 🔧 cần MinIO | ❌ |
| Tạo Quiz + thêm câu hỏi MCQ | ✅ | ✅ | ❌ |
| Chấm bài tập sinh viên | ✅ | ✅ | ❌ |
| Xem danh sách học viên trong khóa | ✅ | ✅ | ❌ |
| Trả lời câu hỏi Forum (với badge Instructor) | ✅ | ✅ | ❌ |

---

### 🛡️ Quản Trị Viên (Admin)

| Tính năng | Web | API | Mobile |
|-----------|:---:|:---:|:------:|
| **Dashboard** (total users, courses, revenue, login audit) | ✅ | ✅ | ❌ |
| Quản lý người dùng (list/search/filter/page) | ✅ | ✅ | ❌ |
| Tạo người dùng mới | ✅ | ✅ | ❌ |
| Sửa thông tin, gán role, khoá tài khoản | ✅ | ✅ | ❌ |
| Xem lịch sử đăng nhập (audit log per user) | ❌ UI | ✅ | ❌ |
| Quản lý Roles & Permissions (CRUD) | ❌ UI | ✅ | ❌ |
| Quản lý đơn hàng / thanh toán | ❌ UI | ✅ | ❌ |
| Quản lý học thuật (Academic) | 🟡 partial | 🟡 partial | ❌ |
| Recent users & Recent logins trên dashboard | ✅ | ✅ | ❌ |

---

## 2. Màn Hình Mobile Chi Tiết

| # | Route | Màn hình | Nội dung chính |
|---|-------|---------|----------------|
| 1 | `/login` | Đăng nhập | Email/password, error, link register/forgot |
| 2 | `/register` | Đăng ký | Tên, email, password |
| 3 | `/forgot-password` | Quên mật khẩu | Nhập email, gửi link reset |
| 4 | `/reset-password` | Đặt lại mật khẩu | Nhập token + mật khẩu mới |
| 5 | `/verify-email` | Xác thực email | Dán token, nút resend |
| 6 | `/home` tab Home | Dashboard | Stats 3 card, enrolled courses horizontal, explore vertical |
| 7 | `/home` tab Khóa học | My Courses | List enrolled → tap → `/learn/:id` |
| 8 | `/home` tab Thông báo | Notifications | List, badge count, mark-read |
| 9 | `/course/:id` | Chi tiết khóa học | Enroll button; khi enrolled: nút **Vào học** + **Xem điểm** |
| 10 | `/learn/:courseId` | **Học bài** | Content area (video/doc/quiz), sidebar section/lesson, mark complete, next lesson |
| 11 | `/quiz/:quizId/:courseId` | **Làm bài kiểm tra** | Start info → MCQ + timer → Submit → Pass/Fail + điểm |
| 12 | `/gradebook/:courseId` | **Bảng điểm** | Summary card, grade items, progress bar từng item |
| 13 | `/profile` | Hồ sơ | Sửa info 8 trường, logout |
| 14 | `/profile/change-password` | Đổi mật khẩu | Old/new/confirm, auto logout khi đổi xong |

**Luồng demo mobile:**  
`Login → Home (stats + courses) → Course detail → Enroll → Vào học → Mark complete → Quiz → Kết quả → Xem điểm`

---

## 3. Phần Đã Làm

### 🔧 Backend API (Spring Boot)

| Module | Endpoints chính | Trạng thái |
|--------|----------------|-----------|
| **Auth** | register, login, refresh, logout, logout-all, me, forgot/reset-password, change-password, verify-email, resend-verification, update-profile | ✅ Hoàn thiện |
| **Course** | CRUD course (slug auto-gen), section, lesson, enroll, progress tick, content | ✅ Hoàn thiện |
| **Assignment** | submit, grade, my-submission, list submissions | ✅ Hoàn thiện |
| **Forum** | post question, reply (role-aware), list Q&A by course/lesson | ✅ Hoàn thiện |
| **Gradebook** | student grades per course | ✅ Hoàn thiện |
| **Quiz/Exam** | create quiz, add questions, get for student (hide answers), submit (auto-grade MCQ), my-attempts | ✅ Hoàn thiện |
| **Stats** | `/student/stats`, `/instructor/stats` | ✅ Hoàn thiện |
| **Notification** | CRUD, unread-count, mark-read, trigger on enroll | ✅ Hoàn thiện |
| **Admin Users** | paged list/search/filter, CRUD, deactivate + revoke tokens, login-audit | ✅ Hoàn thiện |
| **Admin Dashboard** | stats (users/courses/enrollments/revenue), recent-users, recent-logins | ✅ Hoàn thiện |
| **Roles/Permissions** | CRUD roles, CRUD permissions, assign/remove | ✅ Hoàn thiện |
| **Payment** | checkout (free→enroll direct, paid→order+PayOS), webhook, order list | 🔧 Cần PayOS key |
| **Media** | upload file | 🔧 Cần MinIO config |
| **Academic** | Institution, Unit, Position, Program, Major, Cohort CRUD | 🟡 Partial |
| **API Gateway** | Route `/api/v1/**` + `/oauth2/**`, logging filter | ✅ Hoàn thiện |
| **AI Service** | — | ❌ Chưa làm |

**Bảo mật:**
- JWT access/refresh + JTI blacklist (revoke trước expiry)
- Token rotation khi refresh (old token bị revoke)
- Rate limiting login: 5 fail → lock 15 phút (Caffeine)
- `@PreAuthorize` theo role (ADMIN/INSTRUCTOR/STUDENT)
- Login audit log (success + fail reason)
- BCrypt password hashing
- Email verification flow
- Google OAuth2 skeleton (cần credentials)

---

### 🌐 Frontend Web (Next.js 15)

| Trang / Component | Trạng thái |
|-------------------|-----------|
| `/login`, `/register` | ✅ Wire API, redirect theo role (ADMIN/INSTRUCTOR/STUDENT) |
| `/forgot-password`, `/reset-password` | ✅ Wire API |
| `/verify-email` | ✅ Tự verify từ `?token=` URL, nút resend |
| `/oauth2/callback` | ✅ Nhận token từ Google, setAuth, redirect |
| `/courses` | ✅ Paged list, search debounce, free/paid badge, enroll/buy/continue |
| `/courses/[id]` | ✅ Detail, syllabus từ API, CTA card (price + action) |
| `/student` | ✅ Stats thật, enrolled course list |
| `/student/courses` | ✅ List enrolled |
| `/student/courses/[id]/learn` | ✅ Video player, sidebar progress, mark complete, next lesson, quiz nav |
| `/student/courses/[id]/quiz/[id]` | ✅ Start info, timer, MCQ, submit, pass/fail result |
| `/instructor` | ✅ Stats thật (courses/students/pending), course list |
| `/instructor/courses` | ✅ List, nút Tạo mới |
| `/instructor/courses/new` | ✅ Form tạo course đầy đủ |
| `/instructor/courses/[id]` | ✅ Builder: add section/lesson/quiz với dialog |
| `/admin` | ✅ Stats thật, recent users table, recent logins, system health |
| `/admin/users` | ✅ Paged, search, filter role/active, toggle active, soft-delete |
| `/profile` | ✅ Sửa 8 trường + đổi mật khẩu |
| `NotificationBell` | ✅ Badge count (poll 30s), dropdown, mark-read |

---

### 📱 Mobile (Flutter) — 14 màn hình

| # | Màn hình | Trạng thái |
|---|---------|-----------|
| 1 | Login | ✅ |
| 2 | Register | ✅ |
| 3 | Forgot password | ✅ |
| 4 | Reset password | ✅ |
| 5 | Verify email | ✅ |
| 6 | Home Dashboard | ✅ Stats + enrolled + explore + bottom nav |
| 7 | My Courses tab | ✅ List enrolled → vào học |
| 8 | Notifications tab | ✅ List + mark-read + badge |
| 9 | Course detail | ✅ Enroll; khi enrolled: Vào học + Xem điểm |
| 10 | **Learning screen** | ✅ Sidebar section/lesson, mark complete, next, quiz nav |
| 11 | **Quiz screen** | ✅ Start info, timer, MCQ, submit, pass/fail result |
| 12 | **Gradebook screen** | ✅ Summary + item list + progress bar |
| 13 | Profile | ✅ Sửa info, logout |
| 14 | Change password | ✅ |

---

## 4. Còn Thiếu / Chưa Làm

### Web (theo mức độ quan trọng)

| Tính năng | Độ ưu tiên | Ghi chú |
|-----------|:----------:|---------|
| Trang `/payment/success` và `/payment/cancel` | 🔴 Cao | Sau khi PayOS redirect về cần xử lý |
| UI Audit log trong admin user detail | 🟡 Vừa | API đã có, chưa có UI |
| UI Roles & Permissions management | 🟡 Vừa | API đã có `/admin/rbac` |
| UI Quản lý đơn hàng | 🟡 Vừa | API đã có `/payment/orders` |
| Trang `/instructor/courses/[id]/assignments` wire thật | 🟡 Vừa | API đã có, trang có skeleton |
| Trang `/instructor/courses/[id]/students` wire thật | 🟡 Vừa | API đã có |
| Forum UI cho student (đặt câu hỏi trong bài học) | 🟡 Vừa | API đã có |
| Assignment submission form trong learning | 🟡 Vừa | API đã có |
| Academic management UI (`/admin/academic`) | 🟠 Thấp | API partial |
| Reports & Analytics | 🟠 Thấp | Chưa làm |
| Badges & Certificates | 🟠 Thấp | Chưa làm |

### Mobile

| Tính năng | Độ ưu tiên | Ghi chú |
|-----------|:----------:|---------|
| Forum (đặt câu hỏi, xem trả lời) | 🔴 Cao | API đã có |
| Nộp bài tập (Assignment submission) | 🔴 Cao | API đã có |
| Xem lịch sử Quiz attempts | 🟡 Vừa | API `/quizzes/:id/my-attempts` đã có |
| Instructor screens (tạo khóa, quản lý) | 🟡 Vừa | Chưa làm |
| Đăng nhập Google OAuth | 🟠 Thấp | Cần credentials + deep link |
| Mua khóa học (PayOS) | 🟠 Thấp | Cần PayOS key |
| Push notifications (FCM) | 🟠 Thấp | Chưa làm |
| Offline mode | 🟠 Thấp | Phức tạp |

---

## 5. So Sánh Với Moodle

| Tính năng Moodle | eRIPT LMS | Ghi chú |
|-----------------|-----------|---------|
| **Course management** | ✅ | Create, sections, lessons |
| **Quiz với nhiều loại câu hỏi** | 🟡 Chỉ MCQ | Moodle có True/False, Essay, Fill, Matching... |
| **Grading & Gradebook** | 🟡 Cơ bản | Moodle có rubric, scale tùy chỉnh |
| **Assignment** | ✅ Submit/Grade | Moodle có Turnitin, group assignment |
| **Forum/Q&A** | ✅ | Moodle có nhiều loại forum hơn |
| **Enrollment** | ✅ | Moodle có cohort, self-enroll, auto-enroll |
| **Completion tracking** | ✅ | Manual tick; Moodle có auto completion |
| **Progress tracking** | ✅ | Lesson level |
| **Reports & Analytics** | ❌ | Moodle có nhiều loại báo cáo chi tiết |
| **Badges & Certificates** | ❌ | Chưa làm |
| **Plagiarism detection** | ❌ | Không có |
| **SCORM content** | ❌ | Không có |
| **Live class / BigBlueButton** | ❌ | Không có |
| **Mobile app** | ✅ Flutter (14 screens) | Moodle dùng Ionic |
| **REST API** | ✅ | Hiện đại hơn Moodle API |
| **Role-based access** | ✅ RBAC | Tương đương Moodle |
| **Email notifications** | 🔧 Cần SMTP | Moodle gửi được ngay |
| **OAuth/SSO** | 🔧 Cần key | Moodle hỗ trợ nhiều IdP |
| **Payment/Enrollment fee** | 🔧 Cần PayOS | Moodle có PayPal, Stripe |
| **AI features** | ❌ Chưa làm | Moodle không có native |
| **Multi-language** | 🟡 Toggle UI | Moodle hỗ trợ sâu hơn |
| **LTI integration** | ❌ | Moodle hỗ trợ LTI 1.3 |
| **Docker deploy** | ✅ `make up` | Moodle phức tạp hơn |
| **Dark mode UI** | ✅ | Moodle không có sẵn |

**Lợi thế so với Moodle:**
- API design RESTful + JWT, dễ integrate hơn Moodle Web Services
- Flutter mobile app native (Moodle dùng Ionic hybrid)
- Kiến trúc microservices, scale từng phần độc lập
- UI/UX hiện đại (Next.js 15, Tailwind 4, dark mode)
- AI Service sẵn sàng tích hợp Claude API
- Deploy 1 lệnh `make up`

---

## 6. Hướng Dẫn Config Cần Làm

### 6.1 SMTP — Gửi Email Thật

**Vì sao cần:** Email verification và forgot-password hiện chỉ in token ra console (dev mode). User không nhận được email thật.

**Thêm ở đâu:** `.env`

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=yourmail@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx   # App Password, không phải mật khẩu Gmail
MAIL_FROM=yourmail@gmail.com
```

**Thao tác:**
1. Google Account → Security → 2-Step Verification → App passwords
2. Tạo App Password cho "Mail" → copy vào `MAIL_PASSWORD`
3. `docker compose up -d backend`

---

### 6.2 Google OAuth — Đăng Nhập Bằng Google

**Vì sao cần:** Nút "Login with Google" sẽ báo lỗi 500 nếu không có credentials. Feature hoàn toàn ready, chỉ thiếu key.

**Thêm ở đâu:** `.env`

```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

**Thao tác:**
1. [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID → Web application
3. Authorized redirect URIs:
   - Dev: `http://localhost:8080/login/oauth2/code/google`
   - Prod: `https://yourdomain.com/login/oauth2/code/google`
4. Copy keys → `.env` → restart backend

---

### 6.3 PayOS — Thanh Toán Khóa Học Có Phí

**Vì sao cần:** `POST /payment/checkout/:courseId` tạo order nhưng `checkoutUrl` trỏ về mock URL (frontend redirect loop). Cần PayOS SDK để sinh link thật.

**Thêm ở đâu:** `.env`

```bash
PAYOS_CLIENT_ID=xxxxx
PAYOS_API_KEY=xxxxx
PAYOS_CHECKSUM_KEY=xxxxx
```

**Thao tác:**
1. Đăng ký tại [payos.vn](https://payos.vn) (miễn phí sandbox)
2. Developer → API Keys → copy 3 keys
3. Webhook URL: `https://yourdomain.com/api/v1/payment/webhook`
4. Thêm SDK vào `backend/build.gradle.kts`:
   ```kotlin
   implementation("vn.payos:payos-java:1.0.0")
   ```
5. Sửa `PaymentController.buildPayOSLink()`:
   ```java
   PayOS payOS = new PayOS(payosClientId, payosApiKey, payosChecksumKey);
   PaymentData data = PaymentData.builder()
       .orderCode(orderCode)
       .amount(amount.intValue())
       .description("Khóa học #" + courseId)
       .returnUrl(frontendBaseUrl + "/payment/success")
       .cancelUrl(frontendBaseUrl + "/payment/cancel")
       .build();
   return payOS.createPaymentLink(data).getCheckoutUrl();
   ```
6. Tạo `/app/payment/success/page.tsx` và `/app/payment/cancel/page.tsx`

---

### 6.4 MinIO — Upload Video & Tài Liệu

**Vì sao cần:** Instructor nhập video URL thủ công; không có storage thật. MinIO là object storage S3-compatible, chạy local bằng Docker.

**Thêm vào `docker-compose.yml`:**
```yaml
minio:
  image: minio/minio:latest
  container_name: lms-minio
  command: server /data --console-address ":9001"
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin123
  volumes:
    - minio_data:/data
  networks:
    - lms-net

# Trong volumes: thêm minio_data:
```

**Thêm vào `.env`:**
```bash
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=lms-media
```

**Thêm dependency `backend/build.gradle.kts`:**
```kotlin
implementation("io.minio:minio:8.5.7")
```

**Cập nhật `MediaService`** để dùng MinIO client upload file, trả về pre-signed URL.

**Tạo bucket:** Truy cập `http://localhost:9001` (console) → tạo bucket `lms-media` → set public read policy.

---

### 6.5 AI Service — Chat Tư Vấn Học Tập

**Vì sao cần:** `ai-service/` đang rỗng. Đây là điểm khác biệt chính so với Moodle — AI tích hợp sẵn trong hệ thống.

**Thêm vào `.env`:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

**Tạo `ai-service/` (Python FastAPI):**
```
ai-service/
├── main.py
├── requirements.txt
└── Dockerfile
```

**`requirements.txt`:**
```
fastapi==0.115.0
uvicorn==0.30.0
anthropic==0.36.0
python-dotenv==1.0.0
```

**`main.py`:**
```python
from fastapi import FastAPI
from anthropic import Anthropic
import os

app = FastAPI()
client = Anthropic()

SYSTEM_PROMPT = """Bạn là trợ lý học tập thông minh của hệ thống eRIPT LMS - 
PTIT. Hỗ trợ sinh viên về: nội dung bài học, câu hỏi kỹ thuật, 
lộ trình học tập, và tư vấn hướng nghề nghiệp. 
Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu."""

@app.post("/api/v1/ai/chat")
async def chat(body: dict):
    messages = body.get("messages", [{"role": "user", "content": body.get("message", "")}])
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=messages
    )
    return {"reply": response.content[0].text, "model": response.model}

@app.get("/health")
async def health():
    return {"status": "ok"}
```

**`Dockerfile`:**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8082"]
```

**Thêm vào `docker-compose.yml`:**
```yaml
ai-service:
  build:
    context: ./ai-service
  container_name: lms-ai
  ports:
    - "8082:8082"
  environment:
    ANTHROPIC_API_KEY: "${ANTHROPIC_API_KEY}"
  networks:
    - lms-net
```

**Thêm route vào `api-gateway/src/main/resources/application.yml`:**
```yaml
- id: ai-service
  uri: http://ai-service:8082
  predicates:
    - Path=/api/v1/ai/**
```

---

### 6.6 SSL + Domain — Production Deploy

**Vì sao cần:** Demo DATN trên server thật cần HTTPS. Trình duyệt chặn mixed content nếu dùng HTTP.

**Tạo `docker/nginx/nginx.conf`:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /api/ {
        proxy_pass http://api-gateway:8081;
        proxy_set_header Host $host;
    }
}
```

**Cấp SSL miễn phí:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 7. Thứ Tự Ưu Tiên Config

| # | Config | Thời gian | Kết quả |
|---|--------|-----------|---------|
| 1 | **SMTP** (Gmail App Password) | ~15 phút | Email verify + forgot-password chạy thật |
| 2 | **MinIO** (thêm vào compose) | ~30 phút | Instructor upload video/tài liệu được |
| 3 | **Google OAuth** (Google Console) | ~30 phút | Nút "Login with Google" hoạt động |
| 4 | **AI Service** (Python + Claude API) | ~2 giờ | Chat tư vấn học tập trong app |
| 5 | **PayOS** (đăng ký payos.vn) | ~2 giờ | Mua khóa học có phí |
| 6 | **SSL + Domain** (cần server VPS) | ~1 giờ | Production demo HTTPS |

---

## 8. Tóm Tắt Số Liệu

| Hạng mục | Số lượng |
|----------|---------|
| Backend API endpoints | ~80 endpoints |
| Frontend pages | 18 trang |
| Mobile screens | 14 màn hình |
| JUnit tests | 24 tests (0 failures) |
| Docker services | 4 services (mysql, backend, gateway, frontend) |
| Flyway migrations | V1–V4 |
| Entity classes | ~40 entities |
| Java source files | ~200 files |

---

*Cập nhật: 2026-06-13 · eRIPT LMS v0.1.0-SNAPSHOT*
