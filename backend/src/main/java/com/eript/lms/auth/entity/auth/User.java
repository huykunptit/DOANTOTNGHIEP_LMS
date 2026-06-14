package com.eript.lms.auth.entity.auth;

import com.eript.lms.auth.entity.rbac.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 255)
    private String avatar;

    @Column(name = "google_id", length = 100)
    private String googleId;

    @Column(length = 500)
    private String bio;

    @Column(length = 30)
    private String phone;

    @Column(name = "id_card_number", unique = true, length = 50)
    private String idCardNumber;

    @Column(length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 100)
    private String nationality;

    @Column(length = 255)
    private String hometown;

    @Column(name = "permanent_address", length = 500)
    private String permanentAddress;

    @Column(name = "user_type", nullable = false, length = 50)
    private String userType;

    @Column(name = "student_code", unique = true, length = 50)
    private String studentCode;

    @Column(name = "staff_code", unique = true, length = 50)
    private String staffCode;

    @Column(name = "study_status", length = 50)
    private String studyStatus;

    @Column(name = "institution_id")
    private Long institutionId;

    @Column(name = "unit_id")
    private Long unitId;

    @Column(name = "program_id")
    private Long programId;

    @Column(name = "major_id")
    private Long majorId;

    @Column(name = "specialization_id")
    private Long specializationId;

    @Column(name = "cohort_id")
    private Long cohortId;

    @Column(name = "advisor_id")
    private Long advisorId;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    @Column(name = "remember_token", length = 100)
    private String rememberToken;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}
