package com.eript.lms.course.repository.assignment;

import com.eript.lms.course.entity.assignment.LessonAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonAssignmentRepository extends JpaRepository<LessonAssignment, Long> {
    Optional<LessonAssignment> findByLessonId(Long lessonId);
}
