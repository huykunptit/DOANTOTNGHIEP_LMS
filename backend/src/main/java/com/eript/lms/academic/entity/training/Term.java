package com.eript.lms.academic.entity.training;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "terms")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Term {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "enrollment_start_at")
    private LocalDateTime enrollmentStartAt;

    @Column(name = "enrollment_end_at")
    private LocalDateTime enrollmentEndAt;

    @Column(name = "exam_start_at")
    private LocalDateTime examStartAt;

    @Column(name = "exam_end_at")
    private LocalDateTime examEndAt;

    @Column(name = "is_current", nullable = false)
    @Builder.Default
    private Boolean current = false;

    @OneToMany(mappedBy = "term")
    private List<ClassSection> classSections;
}
