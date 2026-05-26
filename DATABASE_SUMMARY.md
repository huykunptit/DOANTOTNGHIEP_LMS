# Tóm tắt Database — Hệ thống LMS (ERIPT)

> Nguồn: `backend/database/migrations/` (Laravel) — tổng cộng **58 migration**.
> Mục đích: tài liệu tổng quan toàn bộ schema để phục vụ chuyển đổi sang kiến trúc **Java Microservice** (`DATNJava/`).
> Cập nhật: 2026-05-25.

---

## 1. Tổng quan kiến trúc dữ liệu

Hệ thống là một LMS lai (hybrid) phục vụ **2 chế độ khóa học**:

- **Marketplace / Extension** — bán khóa học công khai (giống Udemy: `users`, `orders`, `enrollments`, `reviews`).
- **Academic / Formal** — đào tạo chính quy theo cấu trúc trường đại học (`institutions → units → programs → majors → specializations → curricula → cohorts → administrative_classes → class_sections`).

Một `course` có thể vừa bán public, vừa thuộc chương trình đào tạo (`course_mode`, `is_credit_bearing`, `credit_value`).

Các domain chính:

| # | Domain | Mô tả |
|---|--------|-------|
| 1 | Auth & RBAC | Người dùng, token, phân quyền (Spatie) |
| 2 | Org Structure | Cơ sở, đơn vị, vị trí, phân công cán bộ |
| 3 | Academic Structure | Năm học, kỳ học, ngành, chuyên ngành, CTĐT, khóa |
| 4 | Class Management | Lớp tín chỉ (`class_sections`), lớp hành chính |
| 5 | Course & Content | Khóa học, chương (section), bài học, tài liệu |
| 6 | Lesson Types | Video, virtual class, SCORM, offline, assignment |
| 7 | Enrollment & Order | Ghi danh, đơn hàng, thanh toán |
| 8 | Assessment | Quiz, Exam, Question Bank, Attempt, Proctoring |
| 9 | Gradebook & Outcomes | Cấu phần điểm, điểm, CLO/PLO, kỹ năng |
| 10 | Certificate | Mẫu chứng chỉ, chứng chỉ của user |
| 11 | Q&A & Reviews | Hỏi đáp khóa học, đánh giá sao |
| 12 | AI & Career | AI provider, log token, CV, gợi ý nghề |
| 13 | System | Notifications, site settings, cache, jobs |

---

## 2. Auth & Phân quyền

### `users` (mở rộng nhiều lần — bảng "trung tâm")
Cột gốc + các trường mở rộng:
- **Profile**: `name`, `email` (unique), `password`, `avatar`, `google_id`, `bio`, `phone`, `id_card_number` (unique), `gender`, `date_of_birth`, `nationality` (default "Việt Nam"), `hometown`, `permanent_address`
- **Học vụ**: `user_type` (default `student`), `student_code` (unique), `staff_code` (unique), `study_status`
- **Liên kết tổ chức**: `institution_id`, `unit_id`, `program_id`, `major_id`, `specialization_id`, `cohort_id`, `administrative_class_id`, `advisor_id` (cố vấn học tập)
- **Hệ thống**: `email_verified_at`, `remember_token`, `timestamps`

### `password_reset_tokens`, `sessions`, `personal_access_tokens`
Chuẩn Laravel/Sanctum (token API morph theo `tokenable`).

### Spatie Permissions (RBAC)
- `permissions(id, name, guard_name)`
- `roles(id, name, guard_name)` + team support (optional)
- `model_has_permissions`, `model_has_roles`, `role_has_permissions`

---

## 3. Cấu trúc tổ chức (Org Structure)

| Bảng | Mục đích | Khóa quan trọng |
|------|----------|-----------------|
| `institutions` | Cơ sở giáo dục (trường, học viện) | `code` unique |
| `units` | Phòng/khoa/bộ môn (đệ quy `parent_id`, có `level`) | `(institution_id, code)` unique |
| `positions` | Chức vụ (giảng viên, trưởng khoa, ...) | `code` unique, `scope_level` |
| `user_assignments` | Phân công user vào unit + position | `is_primary`, `start_date/end_date`, `status` |

---

## 4. Cấu trúc đào tạo (Academic Structure)

| Bảng | Mục đích |
|------|----------|
| `program_types` | Loại chương trình (CQ, VLVH, LT...) |
| `academic_years` | Năm học (start/end, `is_current`) |
| `terms` | Kỳ học (có `enrollment_*`, `exam_*` windows) |
| `programs` | Chương trình đào tạo (gắn `institution`, `unit`, `program_type`) |
| `majors` | Ngành (thuộc program) |
| `specializations` | Chuyên ngành (thuộc major) |
| `curricula` | Khung CTĐT (program + major + specialization + hiệu lực) |
| `cohorts` | Khóa sinh viên (K2024, K2025...) — `start_year`, `end_year` |
| `curriculum_courses` | **Pivot** môn × CTĐT × kỳ thứ (1..N), `is_required`, `credits` |

### Quản lý lớp (Class Management)
- `class_sections` — **lớp tín chỉ** trong 1 kỳ: `(course_id, term_id, code)` unique, `lecturer_id`, `capacity`, `enrolled_count`, `status`.
- `administrative_classes` — **lớp hành chính** (chủ nhiệm): gắn `institution`, `program`, `major`, `cohort`, `advisor_id`, `expected_graduation_year`.
- `administrative_class_class_section` — pivot: lớp hành chính ↔ lớp tín chỉ (kỳ thứ mấy, ai phân công, khi nào).

---

## 5. Khóa học & Nội dung

### `courses` (bảng cực kỳ giàu trường, ghép cả marketplace + academic)
- **Định danh**: `id`, `code` (unique, thêm ở migration 05-20), `slug` (unique), `title`
- **Tác giả/giá**: `user_id` (cascade), `price` (VND, decimal 12,0)
- **Trạng thái**: `status` (draft|pending_review|published|rejected), `reject_reason`, `published_at`
- **Media**: `thumbnail`, `description`
- **Phân loại**: `category_id`
- **Chế độ**: `course_mode` (default `extension` — vs academic), `is_credit_bearing`, `credit_value`
- **Liên kết học vụ**: `program_type_id`, `program_id`, `major_id`, `curriculum_id`
- **Chứng chỉ**: `certificate_template_id`

### `categories` — đệ quy (`parent_id`), `slug` unique, `icon`, `sort_order`.

### `sections` — chương của khóa học (`course_id`, `position`).

### `lessons` (bài học, gốc 1 cây nhỏ + nhiều loại)
- `course_id`, `section_id`, `title`, `description`
- **Video**: `video_url`, `duration`, `video_size`, `video_status` (pending|processing|ready|failed)
- `order`, `is_preview` (free preview)
- **Loại bài**: `type` (default `video`) — quyết định bảng phụ trợ nào áp dụng (xem mục 6).

### `lesson_attachments` — file đính kèm (`original_name`, `file_path`, `file_size`, `mime_type`).

### `lesson_notes` — ghi chú học viên trên video (có `position_seconds`).

### `lesson_progress` — tiến độ học bài (1 row / user / lesson)
- `completed`, `completed_at`, `progress_percent` (0–100), `last_position` (giây), `watched_seconds`, `last_watched_at`
- `metadata` (JSON) — dùng cho SCORM (`cmi.location`, `suspend_data`, ...)

---

## 6. Loại bài học mở rộng (Lesson Types)

| Bảng | Khi `lesson.type` = ... | Trường chính |
|------|------------------------|--------------|
| `virtual_classes` | virtual / live | `provider` (zoom/google_meet/jitsi), `meeting_id`, `join_url`, `start_url`, `start_at`, `duration` (phút) |
| `scorm_packages` | scorm | `uuid` unique, `version` (1.2/2004), `entry_url`, `identifier` |
| `offline_sessions` | offline | `location`, `start_at`, `duration`, `max_participants` |
| `lesson_assignments` | assignment | `instructions`, `max_file_size`, `allowed_extensions`, **3 mốc thời gian** (kiểu Moodle): `available_from`, `submission_open_at`, `due_at` |
| `assignment_submissions` | (bài nộp) | `lesson_assignment_id`, `user_id`, `file_url`, `student_note`, `grade`, `feedback`, `submitted_at` |

---

## 7. Ghi danh & Thanh toán

### `enrollments` (1 user × course là **unique**)
- `user_id`, `course_id`, `order_id` (nullable)
- **Mở rộng học vụ**: `term_id`, `cohort_id`, `class_section_id`
- `enrollment_source` (default `marketplace` — vs `academic`, `import`, ...)
- `enrolled_at`

### `orders`
- `user_id`, `course_id`, `amount` (VND 12,0), `status` (pending|completed|failed|refunded)
- `payment_method` (payos|momo|zalopay|bank_transfer|free)
- `payment_ref` unique (gateway tx id), `gateway_response` (JSON), `paid_at`

---

## 8. Đánh giá (Assessment) — phần phức tạp nhất

Đã trải qua **nhiều lần restructure** (4 migration upgrade) — tóm tắt schema cuối:

### Ngân hàng câu hỏi
- `question_banks(course_id, name, description)`
- `question_groups(course_id, question_bank_id, name, sort_order)`
- `questions`:
  - `code` (unique), `course_id`, `question_bank_id`, `question_group_id`
  - `content`, `type` (single_choice|multiple_choice|matching|...)
  - `difficulty` (1–5), `default_score` (8,2), `explanation`, `feedback`, `general_feedback`, `metadata` (JSON)
- `answers`:
  - `question_id`, `content`, `sub_content` (cho matching), `is_correct`, `order`, `sort_order`
- `question_attachments(question_id, original_name, file_path, type: file|image|audio)`

### Quiz (bài kiểm tra ở lesson, course, hoặc exam)
- `quizzes`: `lesson_id` (nullable), `course_id` (nullable), `exam_id` (nullable), `scope` (lesson|course|exam)
- `title`, `description`, `time_limit` (phút), `pass_score` (default 80%)
- `settings` (JSON) — randomization rules, ví dụ `{"randomize": true, "rules": [{"bank_id": 1, "count": 10}]}`
- `quiz_question` (pivot): `(quiz_id, question_id)` unique, `order`, `points`

### Exam (bài thi cấp khóa hoặc standalone)
- `exams`: `course_id` (nullable — standalone), `type` (course_final|standalone)
- `status`, `duration`, `pass_score`, `max_attempts`
- `starts_at`, `ends_at`
- `shuffle_questions`, `shuffle_answers`, `review_options` (JSON)
- **Proctoring**: `proctoring_enabled`, `proctoring_settings` (JSON)
- `created_by`

### Lượt làm bài
- `quiz_attempts`:
  - `quiz_id`, `user_id`, `status` (in_progress|paused|submitted|force_stopped)
  - `score` (5,2), `passed`
  - `question_ids` (JSON — đề random), `answers_json`, `answers_data`
  - **Thời gian**: `started_at`, `completed_at`, `paused_at`, `resumed_at`, `paused_duration`, `time_extensions`, `auto_saved_at`
  - **Audit**: `ip_address`, `user_agent`, `force_stop_reason`
- `exam_enrollments`: `(exam_id, user_id)` unique, `enrolled_by` — cho standalone exam
- `exam_violations`: log gian lận khi proctoring — `attempt_id`, `type` (focus_lost|no_face|multiple_faces|suspicious), `severity` (warning|critical), `snapshot_url`, `metadata`

---

## 9. Sổ điểm & Chuẩn đầu ra (Outcomes)

### Gradebook
- `grade_components(course_id, name, weight%, max_score, is_required, position)` — cấu phần điểm của khóa.
  - Ví dụ: chuyên cần 10%, giữa kỳ 30%, cuối kỳ 60%.
- `grade_entries(enrollment_id, grade_component_id, score, graded_by, graded_at, note)` — 1 dòng / SV / cấu phần.

### CLO / PLO / Skills
- `program_learning_outcomes(program_id, code, description, level: knowledge|skill|attitude)`
- `course_learning_outcomes(course_id, code, description)`
- `clo_plo_map(clo_id, plo_id, weight)` — ma trận ánh xạ CLO ↔ PLO.
- `skills(code unique, name, category, description)` — kho kỹ năng dùng chung.
- `course_skills(course_id, skill_id, weight)` — môn dạy kỹ năng nào.

---

## 10. Chứng chỉ

- `certificate_templates(name, background_image_url)`
- `user_certificates(user_id, course_id, certificate_template_id, credential_id unique, issued_at)`
- `courses.certificate_template_id` — mẫu chứng chỉ mặc định khi user hoàn thành khóa.

---

## 11. Q&A & Reviews

### Hỏi đáp khóa học
- `course_qas(user_id, course_id, lesson_id?, subject, content)`
- `course_qa_replies(course_qa_id, user_id, content)`
- `qa_reactions` — like/dislike **polymorphic** (`reactable_type`, `reactable_id`) áp dụng cả question lẫn reply; 1 user / item duy nhất, `kind` ∈ {like, dislike}.

### Đánh giá khóa học (rating)
- `reviews(user_id, course_id, rating 1-5, comment)` — unique `(user_id, course_id)`.

---

## 12. AI & Career Advisor

### AI Provider Management
- `ai_settings(provider, model, api_key, monthly_token_quota, tokens_used, max_requests_per_minute, is_active, quota_reset_at)` — provider hiện hỗ trợ: `chatgpt | gemini | claude`.
- `ai_request_logs(user_id, endpoint, provider, model, tokens_used, response_time_ms, status, error_message)` — audit toàn bộ request AI.

### Cố vấn nghề nghiệp
- `user_cvs(user_id, file_path, file_name, parsed_text, skills JSON)`
- `job_postings(title, company, description, required_skills JSON, location)`
- `career_recommendations(user_id, job_id?, match_score, skill_gaps JSON, suggested_courses JSON, ai_summary)`

---

## 13. Tiện ích hệ thống

- `notifications(user_id, type, title, message, link, read_at)` — `type` ∈ enrollment | order | course_approved | course_rejected | review | system.
- `site_settings(key unique, value)` — đã seed: `site_name`, `site_description`, `site_logo`, `site_favicon`, `smtp_*`.
- `cache`, `cache_locks` — Laravel cache driver=database.
- `jobs`, `job_batches`, `failed_jobs` — Laravel queue.

---

## 14. Quan hệ then chốt (gợi ý khi thiết kế microservice)

```
User ──< user_assignments >── Unit ── Institution
  │
  ├── student_code / staff_code
  ├── administrative_class_id ── AdministrativeClass ── Cohort
  └── advisor_id (self FK)

Institution ── Program ── Major ── Specialization
                  │         │
                  └── Curriculum ──< curriculum_courses >── Course
                                                              │
ClassSection (term + lecturer) ───────────────────────────────┤
   │                                                          │
   └──< administrative_class_class_section >── AdministrativeClass

Course ── Section ── Lesson ── (VirtualClass | ScormPackage | OfflineSession | LessonAssignment)
   │         │         │
   │         │         ├── LessonAttachment
   │         │         ├── LessonNote (per user)
   │         │         └── LessonProgress (per user)
   │
   ├── Quiz ──< quiz_question >── Question ── Answer
   │     │                          │
   │     └── QuizAttempt            └── QuestionBank / QuestionGroup / QuestionAttachment
   │
   ├── Exam ── ExamEnrollment / ExamViolation
   ├── GradeComponent ── GradeEntry (per Enrollment)
   ├── CourseLearningOutcome ──< clo_plo_map >── ProgramLearningOutcome
   ├── CourseSkill ── Skill
   ├── CourseQa ── CourseQaReply ── (QaReaction polymorphic)
   ├── Review
   └── CertificateTemplate ── UserCertificate

User ── Enrollment (course + term + cohort + class_section) ── Order (payos|momo|zalopay)
User ── UserCV ── CareerRecommendation ── JobPosting
```

---

## 15. Gợi ý phân chia Java Microservice

Dựa trên domain ở mục 1, đề xuất tách service như sau (đã khớp với cấu trúc đang có ở `DATNJava/`):

| Service (gợi ý) | Sở hữu bảng |
|------------------|-------------|
| **auth-service** | `users`, `password_reset_tokens`, `sessions`, `personal_access_tokens`, `permissions`, `roles`, `model_has_*`, `role_has_permissions` |
| **academic-service** | `institutions`, `units`, `positions`, `user_assignments`, `program_types`, `academic_years`, `terms`, `programs`, `majors`, `specializations`, `curricula`, `cohorts`, `curriculum_courses`, `class_sections`, `administrative_classes`, `administrative_class_class_section` |
| **course-service** | `categories`, `courses`, `sections`, `lessons`, `lesson_attachments`, `lesson_notes`, `lesson_progress`, `virtual_classes`, `scorm_packages`, `offline_sessions`, `lesson_assignments`, `assignment_submissions`, `reviews`, `course_qas`, `course_qa_replies`, `qa_reactions`, `enrollments`, `program_learning_outcomes`, `course_learning_outcomes`, `clo_plo_map`, `skills`, `course_skills`, `grade_components`, `grade_entries`, `certificate_templates`, `user_certificates` |
| **exam-service** | `question_banks`, `question_groups`, `questions`, `answers`, `question_attachments`, `quizzes`, `quiz_question`, `quiz_attempts`, `exams`, `exam_enrollments`, `exam_violations` |
| **payment-service** | `orders` |
| **media-service** | (Không có bảng riêng — quản lý MinIO/S3 cho `video_url`, attachments, SCORM packages) |
| **ai-service** | `ai_settings`, `ai_request_logs`, `user_cvs`, `job_postings`, `career_recommendations` |
| **notification-service** | `notifications` |
| **api-gateway** | (routing + auth filter) |

> **Lưu ý cross-service**: `enrollments`, `grade_entries`, `quiz_attempts`, `user_certificates` đụng nhiều domain — cân nhắc dùng **event bus** (Kafka/RabbitMQ) để đồng bộ, hoặc giữ FK mềm (`user_id`, `course_id` là long, không enforce DB FK).

---

## 16. Ghi chú vận hành quan trọng

1. **Tiền tệ**: `decimal(12, 0)` — VND, không có phần thập phân. Java nên dùng `BigDecimal` với scale=0 hoặc `long`.
2. **Soft delete**: Hầu hết bảng dùng `cascadeOnDelete` / `nullOnDelete` — KHÔNG có `deleted_at` (chưa dùng SoftDeletes). Khi migrate sang JPA cần cân nhắc.
3. **JSON columns**: `quizzes.settings`, `quiz_attempts.answers_json/answers_data/question_ids`, `lesson_progress.metadata`, `exams.review_options/proctoring_settings`, `ai_*`, `career_recommendations.*`, `users` không có JSON — Java dùng `@JdbcTypeCode(SqlTypes.JSON)` hoặc Jackson converter.
4. **Polymorphic**: `qa_reactions.reactable_type/id`, `personal_access_tokens.tokenable_type/id` — Java cần thiết kế lại (interface + discriminator hoặc bảng riêng).
5. **Unique constraints**: Quan trọng nhất:
   - `users.email`, `users.student_code`, `users.staff_code`, `users.id_card_number`
   - `enrollments(user_id, course_id)`, `reviews(user_id, course_id)`
   - `courses.slug`, `courses.code`
   - `user_certificates.credential_id`, `orders.payment_ref`
6. **Index hot path**: `courses(status)`, `courses(category_id)`, `courses(course_mode, status)`, `enrollments(class_section_id, enrollment_source)`, `notifications(user_id, read_at)`.
7. **Migration `2026_04_08_154336_create_quiz_answers_table.php`** đã bị **comment out toàn bộ** — bảng `quiz_answers` không tồn tại, đã được thay bằng `answers`.

---

*File này là snapshot của schema tại thời điểm 2026-05-25. Khi schema thay đổi, hãy re-generate.*
