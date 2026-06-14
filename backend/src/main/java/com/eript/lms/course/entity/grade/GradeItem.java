package com.eript.lms.course.entity.grade;

import com.eript.lms.course.entity.content.Course;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

import java.math.BigDecimal;

@Entity
@Table(name = "grade_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "item_type", nullable = false, length = 50)
    private String itemType; // QUIZ, ASSIGNMENT, MANUAL

    @Column(name = "item_id")
    private Long itemId; // ID of the quiz or assignment

    @Column(nullable = false, length = 255)
    private String name;

    @Builder.Default
    @Column(name = "max_score", nullable = false, precision = 8, scale = 2)
    private BigDecimal maxScore = new BigDecimal("100.00");

    @Builder.Default
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight = new BigDecimal("1.00");

    @Column(name = "sort_order")
    private Integer sortOrder;
}
