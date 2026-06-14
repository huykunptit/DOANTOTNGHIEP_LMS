package com.eript.lms.course.repository;

import com.eript.lms.course.entity.content.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseIdOrderByPositionAsc(Long courseId);
}
