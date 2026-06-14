package com.eript.lms.course.repository.forum;

import com.eript.lms.course.entity.forum.CourseQA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseQARepository extends JpaRepository<CourseQA, Long> {
    Page<CourseQA> findByCourseId(Long courseId, Pageable pageable);
    List<CourseQA> findByLessonId(Long lessonId);
}
