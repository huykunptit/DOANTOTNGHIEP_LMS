package com.eript.lms.exam.repository.assessment;

import com.eript.lms.exam.entity.assessment.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCourseId(Long courseId);
    List<Quiz> findByLessonId(Long lessonId);
}
