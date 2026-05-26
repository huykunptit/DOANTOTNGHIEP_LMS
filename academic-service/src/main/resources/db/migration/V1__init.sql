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
    parent_id BIGINT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    type VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_units_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT fk_units_parent FOREIGN KEY (parent_id) REFERENCES units(id),
    CONSTRAINT uq_units_institution_code UNIQUE (institution_id, code)
);

CREATE TABLE positions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    scope_level VARCHAR(50),
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    unit_id BIGINT NOT NULL,
    position_id BIGINT NOT NULL,
    primary_assignment BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    CONSTRAINT fk_user_assignments_unit FOREIGN KEY (unit_id) REFERENCES units(id),
    CONSTRAINT fk_user_assignments_position FOREIGN KEY (position_id) REFERENCES positions(id)
);

CREATE TABLE program_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500)
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

CREATE TABLE programs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    unit_id BIGINT NULL,
    program_type_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    degree_level VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_programs_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT fk_programs_unit FOREIGN KEY (unit_id) REFERENCES units(id),
    CONSTRAINT fk_programs_program_type FOREIGN KEY (program_type_id) REFERENCES program_types(id)
);

CREATE TABLE majors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_majors_program FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE specializations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    major_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_specializations_major FOREIGN KEY (major_id) REFERENCES majors(id)
);

CREATE TABLE cohorts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    start_year INT NOT NULL,
    end_year INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE curricula (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_id BIGINT NOT NULL,
    major_id BIGINT NULL,
    specialization_id BIGINT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    effective_from DATE,
    effective_to DATE,
    total_credits INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_curricula_program FOREIGN KEY (program_id) REFERENCES programs(id),
    CONSTRAINT fk_curricula_major FOREIGN KEY (major_id) REFERENCES majors(id),
    CONSTRAINT fk_curricula_specialization FOREIGN KEY (specialization_id) REFERENCES specializations(id)
);

CREATE TABLE curriculum_courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    curriculum_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    semester_no INT NOT NULL,
    credits INT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT,
    CONSTRAINT fk_curriculum_courses_curriculum FOREIGN KEY (curriculum_id) REFERENCES curricula(id)
);

CREATE TABLE administrative_classes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    institution_id BIGINT NOT NULL,
    program_id BIGINT NOT NULL,
    major_id BIGINT NOT NULL,
    cohort_id BIGINT NOT NULL,
    advisor_id BIGINT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    expected_graduation_year INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_administrative_classes_institution FOREIGN KEY (institution_id) REFERENCES institutions(id),
    CONSTRAINT fk_administrative_classes_program FOREIGN KEY (program_id) REFERENCES programs(id),
    CONSTRAINT fk_administrative_classes_major FOREIGN KEY (major_id) REFERENCES majors(id),
    CONSTRAINT fk_administrative_classes_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id)
);

CREATE TABLE class_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    term_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    lecturer_id BIGINT NULL,
    capacity INT NOT NULL,
    enrolled_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_class_sections_term FOREIGN KEY (term_id) REFERENCES terms(id)
);

CREATE TABLE administrative_class_class_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    administrative_class_id BIGINT NOT NULL,
    class_section_id BIGINT NOT NULL,
    assigned_by BIGINT NULL,
    assigned_at DATETIME,
    semester_no INT,
    CONSTRAINT fk_admin_class_sections_admin_class FOREIGN KEY (administrative_class_id) REFERENCES administrative_classes(id),
    CONSTRAINT fk_admin_class_sections_class_section FOREIGN KEY (class_section_id) REFERENCES class_sections(id)
);
