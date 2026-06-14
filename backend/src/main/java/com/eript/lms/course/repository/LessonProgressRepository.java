package com.eript.lms.course.repository;

import com.eript.lms.course.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByLessonIdAndUserId(Long lessonId, Long userId);
    List<LessonProgress> findByUserIdAndLesson_Section_CourseId(Long userId, Long courseId);

    long countByUserIdAndCompleted(Long userId, Boolean completed);
}
