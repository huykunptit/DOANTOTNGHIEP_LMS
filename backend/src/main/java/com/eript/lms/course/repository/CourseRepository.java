package com.eript.lms.course.repository;

import com.eript.lms.course.entity.content.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByCode(String code);

    Optional<Course> findBySlug(String slug);

    boolean existsByCode(String code);

    boolean existsBySlug(String slug);

    org.springframework.data.domain.Page<Course> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(String title, String code, org.springframework.data.domain.Pageable pageable);

    java.util.List<Course> findByUserId(Long userId);

    long countByActive(Boolean active);
}
