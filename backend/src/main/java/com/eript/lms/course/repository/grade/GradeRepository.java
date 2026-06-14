package com.eript.lms.course.repository.grade;

import com.eript.lms.course.entity.grade.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByGradeItemCourseIdAndUserId(Long courseId, Long userId);
    List<Grade> findByGradeItemId(Long gradeItemId);
    Optional<Grade> findByGradeItemIdAndUserId(Long gradeItemId, Long userId);
}
