CREATE TABLE lesson_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lesson_id BIGINT NOT NULL UNIQUE,
    instructions TEXT,
    max_score DECIMAL(8,2) NOT NULL DEFAULT 100,
    due_date DATETIME,
    allow_late_submission BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lesson_assignments_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE assignment_submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    assignment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_url VARCHAR(500),
    content TEXT,
    status VARCHAR(50) NOT NULL, -- SUBMITTED, LATE, GRADED
    score DECIMAL(8,2),
    feedback TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    graded_at DATETIME,
    graded_by BIGINT,
    CONSTRAINT fk_assignment_submissions_assignment FOREIGN KEY (assignment_id) REFERENCES lesson_assignments(id),
    CONSTRAINT uk_assignment_user_submission UNIQUE (assignment_id, user_id)
);

CREATE TABLE course_qas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    lesson_id BIGINT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_qas_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE course_qa_replies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    qa_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_instructor_reply BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_qa_replies_qa FOREIGN KEY (qa_id) REFERENCES course_qas(id)
);

CREATE TABLE grade_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- QUIZ, ASSIGNMENT, MANUAL
    item_id BIGINT, -- ID of the quiz or assignment
    name VARCHAR(255) NOT NULL,
    max_score DECIMAL(8,2) NOT NULL DEFAULT 100,
    weight DECIMAL(5,2) NOT NULL DEFAULT 1.0, -- Multiplier
    sort_order INT,
    CONSTRAINT fk_grade_items_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE grades (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    grade_item_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    score DECIMAL(8,2) NOT NULL,
    feedback TEXT,
    graded_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_grades_item FOREIGN KEY (grade_item_id) REFERENCES grade_items(id),
    CONSTRAINT uk_grade_user_item UNIQUE (grade_item_id, user_id)
);
