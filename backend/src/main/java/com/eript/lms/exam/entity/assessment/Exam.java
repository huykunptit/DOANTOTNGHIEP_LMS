package com.eript.lms.exam.entity.assessment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exams")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "pass_score", precision = 8, scale = 2)
    private BigDecimal passScore;

    @Column(name = "max_attempts")
    private Integer maxAttempts;

    @Column(name = "starts_at")
    private LocalDateTime startsAt;

    @Column(name = "ends_at")
    private LocalDateTime endsAt;

    @Column(name = "shuffle_questions", nullable = false)
    @Builder.Default
    private Boolean shuffleQuestions = false;

    @Column(name = "shuffle_answers", nullable = false)
    @Builder.Default
    private Boolean shuffleAnswers = false;

    @Column(name = "review_options", columnDefinition = "TEXT")
    private String reviewOptions;

    @Column(name = "proctoring_enabled", nullable = false)
    @Builder.Default
    private Boolean proctoringEnabled = false;

    @Column(name = "proctoring_settings", columnDefinition = "TEXT")
    private String proctoringSettings;

    @Column(name = "created_by")
    private Long createdBy;

    @OneToMany(mappedBy = "exam")
    private List<ExamEnrollment> enrollments;
}
