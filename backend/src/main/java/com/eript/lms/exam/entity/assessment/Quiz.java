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
import java.util.List;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id")
    private Long lessonId;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "exam_id")
    private Long examId;

    @Column(nullable = false, length = 50)
    private String scope;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(name = "time_limit")
    private Integer timeLimit;

    @Column(name = "pass_score", precision = 8, scale = 2)
    private BigDecimal passScore;

    @Column(columnDefinition = "TEXT")
    private String settings;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "quiz")
    private List<QuizQuestion> quizQuestions;
}
