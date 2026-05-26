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

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
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
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);
