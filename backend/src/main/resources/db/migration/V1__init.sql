CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    guard_name VARCHAR(50) NOT NULL
);

CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    guard_name VARCHAR(50) NOT NULL
);

CREATE TABLE role_permission (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    google_id VARCHAR(100),
    bio VARCHAR(500),
    phone VARCHAR(30),
    id_card_number VARCHAR(50) UNIQUE,
    gender VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    hometown VARCHAR(255),
    permanent_address VARCHAR(500),
    user_type VARCHAR(50) NOT NULL,
    student_code VARCHAR(50) UNIQUE,
    staff_code VARCHAR(50) UNIQUE,
    study_status VARCHAR(50),
    institution_id BIGINT,
    unit_id BIGINT,
    program_id BIGINT,
    major_id BIGINT,
    specialization_id BIGINT,
    cohort_id BIGINT,
    administrative_class_id BIGINT,
    advisor_id BIGINT,
    email_verified_at DATETIME,
    remember_token VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE institutions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE units (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    parent_id BIGINT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_units_institution FOREIGN KEY (institution_id) REFERENCES institutions(id)
);

CREATE TABLE positions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    scope_level VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE academic_years (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE terms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    academic_year_id BIGINT NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_start_at DATETIME,
    enrollment_end_at DATETIME,
    exam_start_at DATETIME,
    exam_end_at DATETIME,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_terms_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

CREATE TABLE program_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500)
);

CREATE TABLE cohorts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE programs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_type_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_programs_program_type FOREIGN KEY (program_type_id) REFERENCES program_types(id)
);

CREATE TABLE majors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_majors_program FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE specializations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    major_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_specializations_major FOREIGN KEY (major_id) REFERENCES majors(id)
);

CREATE TABLE curricula (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_curricula_program FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(100),
    sort_order INT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    thumbnail VARCHAR(255),
    price DECIMAL(12,0) NOT NULL,
    status VARCHAR(50) NOT NULL,
    reject_reason VARCHAR(500),
    published_at DATETIME,
    category_id BIGINT,
    user_id BIGINT NOT NULL,
    course_mode VARCHAR(50) NOT NULL,
    is_credit_bearing BOOLEAN NOT NULL DEFAULT FALSE,
    credit_value INT,
    program_type_id BIGINT,
    program_id BIGINT,
    major_id BIGINT,
    curriculum_id BIGINT,
    certificate_template_id BIGINT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_courses_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    position INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT fk_sections_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE lessons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    video_url VARCHAR(500),
    duration INT,
    video_size BIGINT,
    video_status VARCHAR(50),
    order_index INT NOT NULL,
    is_preview BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_lessons_section FOREIGN KEY (section_id) REFERENCES sections(id)
);

CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1000),
    CONSTRAINT fk_reviews_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE media_files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    scope VARCHAR(50) NOT NULL,
    created_at DATETIME
);

CREATE TABLE question_banks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE question_groups (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_bank_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT
);

CREATE TABLE questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    course_id BIGINT NOT NULL,
    question_bank_id BIGINT NOT NULL,
    question_group_id BIGINT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    difficulty INT NOT NULL,
    default_score DECIMAL(8,2),
    explanation TEXT,
    feedback TEXT,
    general_feedback TEXT,
    metadata TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    sub_content TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT
);

CREATE TABLE question_attachments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE quizzes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lesson_id BIGINT NULL,
    course_id BIGINT NULL,
    exam_id BIGINT NULL,
    scope VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    time_limit INT,
    pass_score DECIMAL(8,2),
    settings TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE quiz_question (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    sort_order INT,
    points DECIMAL(8,2)
);

CREATE TABLE quiz_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    score DECIMAL(5,2),
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    question_ids TEXT,
    answers_json TEXT,
    answers_data TEXT,
    started_at DATETIME,
    completed_at DATETIME
);

CREATE TABLE exams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    pass_score DECIMAL(8,2),
    max_attempts INT,
    starts_at DATETIME,
    ends_at DATETIME,
    shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
    shuffle_answers BOOLEAN NOT NULL DEFAULT FALSE,
    review_options TEXT,
    proctoring_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    proctoring_settings TEXT,
    created_by BIGINT NULL
);

CREATE TABLE exam_enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    enrolled_by BIGINT NULL,
    enrolled_at DATETIME
);

CREATE TABLE exam_violations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attempt_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    snapshot_url VARCHAR(500),
    metadata TEXT,
    created_at DATETIME
);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    read_at DATETIME,
    created_at DATETIME
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_ref VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payload TEXT,
    created_at DATETIME,
    CONSTRAINT fk_payment_transactions_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE ai_request_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    feature VARCHAR(100) NOT NULL,
    request_payload TEXT,
    response_payload TEXT,
    token_usage INT,
    created_at DATETIME
);
