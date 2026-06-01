# Database Design Overview — ERIPT LMS

Cập nhật: 2026-05-27

## 1. Mục tiêu thiết kế

Hệ thống LMS được tách theo microservice, mỗi service sở hữu database riêng để đảm bảo:

- độc lập triển khai
- độc lập scale
- hạn chế coupling dữ liệu
- dễ migrate và backup
- dễ tối ưu theo nghiệp vụ

## 2. Chọn DB theo service

### PostgreSQL
Dùng cho các service có dữ liệu nghiệp vụ phức tạp, nhiều JSON/log/audit/ràng buộc:

- `course-service`  
  Lý do: progress, quiz config, review, Q&A, certificate, nhiều dữ liệu trạng thái.
- `exam-service`  
  Lý do: attempt, proctoring, snapshot đề thi, JSON answer data, audit.
- `notification-service`  
  Lý do: log + filter theo user/read status, dễ mở rộng về event flow.

### MySQL 8
Dùng cho các service còn lại để triển khai nhanh, dễ vận hành:

- `auth-service`
- `academic-service`
- `payment-service` (khi làm sau)
- `media-service`
- `ai-service` (nếu không dùng vector DB riêng)

> Nếu muốn đồng bộ 100% và đơn giản hoá vận hành ban đầu, có thể dùng MySQL cho tất cả.  
> Nhưng với LMS lớn, cách chia trên là hợp lý hơn.

## 3. Phân vùng dữ liệu theo nghiệp vụ

### 3.1 Auth & Identity — `auth-service`
Quản lý:
- users
- roles
- permissions
- refresh_tokens
- password reset / token flow

Quy tắc:
- các service khác chỉ giữ `userId`
- không join trực tiếp sang `users` từ DB khác

### 3.2 Học vụ / Tổ chức — `academic-service`
Quản lý:
- institutions
- units
- positions
- user_assignments
- program_types
- academic_years
- terms
- programs
- majors
- specializations
- curricula
- cohorts
- administrative_classes
- class_sections
- curriculum_courses
- administrative_class_class_section

Đặc trưng:
- dữ liệu cấu trúc, quan hệ rõ
- CRUD + tree query + mapping theo kỳ học

### 3.3 Học tập — `course-service`
Quản lý:
- categories
- courses
- sections
- lessons
- lesson_progress
- lesson_notes
- lesson_attachments
- virtual_classes
- scorm_packages
- offline_sessions
- lesson_assignments
- assignment_submissions
- enrollments
- reviews
- course_qas
- course_qa_replies
- qa_reactions
- grade_components
- grade_entries
- certificate_templates
- user_certificates

Đặc trưng:
- read/write nhiều
- progress và engagement tăng dần theo thời gian
- có JSON fields cho settings/metadata

### 3.4 Thi — `exam-service`
Quản lý:
- question_banks
- question_groups
- questions
- answers
- question_attachments
- quizzes
- quiz_question
- quiz_attempts
- exams
- exam_enrollments
- exam_violations

Đặc trưng:
- attempt/audit rất quan trọng
- dữ liệu lớn theo thời gian
- cần snapshot và log chi tiết

### 3.5 Thanh toán — `payment-service`
Quản lý:
- orders
- payment_transactions
- refunds (nếu có)
- webhook logs

Đặc trưng:
- tính nhất quán cao
- cần idempotency

### 3.6 Thông báo — `notification-service`
Quản lý:
- notifications
- read status
- delivery metadata (nếu mở rộng)

Đặc trưng:
- bám event từ service khác
- insert nhiều, query theo user

### 3.7 Media — `media-service`
Quản lý:
- metadata file
- owner
- scope
- mime type
- file size
- storage path

File thật lưu ở:
- MinIO / S3

### 3.8 AI — `ai-service`
Quản lý:
- ai_settings
- ai_request_logs
- user_cvs
- job_postings
- career_recommendations

Nếu cần vector search:
- ưu tiên pgvector / Qdrant / Milvus

## 4. Quy tắc cross-service

### Không dùng FK xuyên service
Ví dụ:
- `course-service` không FK đến `auth-service.users`
- `exam-service` không FK đến `course-service.courses`

Thay vào đó dùng:
- `userId`
- `courseId`
- `termId`
- `classSectionId`

### Đồng bộ qua event
Các event quan trọng:
- `UserRegistered`
- `CoursePublished`
- `EnrollmentCreated`
- `QuizSubmitted`
- `ExamCompleted`
- `PaymentSucceeded`
- `NotificationCreated`

## 5. Data patterns quan trọng

### 5.1 Hot tables
- `lesson_progress`
- `quiz_attempts`
- `notifications`
- `ai_request_logs`

### 5.2 Index nên có
- `users.email`
- `users.student_code`
- `users.staff_code`
- `courses.slug`
- `courses.code`
- `enrollments(user_id, course_id)`
- `reviews(user_id, course_id)`
- `notifications(user_id, read_at)`
- `quiz_attempts(quiz_id, user_id)`
- `quiz_attempts(user_id, status)`
- `class_sections(term_id, course_id)`

### 5.3 JSON fields
Dùng khi dữ liệu linh hoạt:
- quiz settings
- attempt answers
- exam proctoring settings
- AI request payload/metadata
- career recommendation data

## 6. Seeder strategy

Seeder nên chia theo 3 lớp:

### Lớp 1 — Master data
Seed trước:
- roles
- permissions
- institutions
- unit tree
- positions
- program types
- academic years
- terms
- categories

### Lớp 2 — Sample operational data
Seed sau:
- admin user
- lecturer user
- student user
- sample program/major/specialization
- sample curriculum
- sample course/section/lesson
- sample question bank / quiz / exam

### Lớp 3 — System defaults
Seed:
- site settings
- default notification types
- default AI config stub

## 7. Gợi ý seed theo service

### `auth-service`
- admin role
- lecturer role
- student role
- default permissions
- admin user

### `academic-service`
- 1 institution
- 2-3 units
- 2-3 positions
- 1 program type
- 1 academic year
- 2 terms
- 1 program
- 1 major
- 1 specialization
- 1 cohort
- 1 administrative class

### `course-service`
- 3 categories
- 1-2 courses
- 1 section/course
- 2-3 lessons
- 1 review mẫu
- 1 QA mẫu

### `exam-service`
- 1 question bank
- 1 group
- 5 questions
- 1 quiz
- 1 exam
- 1 attempt mẫu

### `notification-service`
- 3 notification types mẫu
- 1-2 notification cho user test

### `media-service`
- file metadata mẫu cho avatar / lesson attachment

## 8. Kết luận chọn DB

Khuyến nghị chốt:

- `auth-service` → MySQL
- `academic-service` → MySQL
- `course-service` → PostgreSQL
- `exam-service` → PostgreSQL
- `notification-service` → PostgreSQL
- `media-service` → MySQL
- `ai-service` → MySQL hoặc PostgreSQL tùy nhu cầu vector/log
- `payment-service` → MySQL

Nếu muốn đơn giản hóa giai đoạn đầu:
- có thể dùng toàn bộ MySQL 8
- sau đó tách `course/exam/notification` sang PostgreSQL khi tải tăng

## 9. Tài liệu liên quan

- `DATABASE_SUMMARY.md` — snapshot schema tổng quan
- `DATABASE_DESIGN.md` — thiết kế chốt để triển khai và seed

