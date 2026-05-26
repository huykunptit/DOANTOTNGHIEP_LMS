package com.eript.academic.repository.training;

import com.eript.academic.entity.training.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {

    Optional<ClassSection> findByCode(String code);

    List<ClassSection> findAllByTermId(Long termId);

    List<ClassSection> findAllByCourseId(Long courseId);
}
