package com.eript.lms.academic.entity.training;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "curriculum_courses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurriculumCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "semester_no", nullable = false)
    private Integer semesterNo;

    @Column(nullable = false)
    private Integer credits;

    @Column(name = "is_required", nullable = false)
    private Boolean required = true;

    @Column(name = "sort_order")
    private Integer sortOrder;
}
