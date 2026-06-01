package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.CurriculumCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumCourseRepository extends JpaRepository<CurriculumCourse, Long> {

    List<CurriculumCourse> findAllByCurriculumId(Long curriculumId);
}
