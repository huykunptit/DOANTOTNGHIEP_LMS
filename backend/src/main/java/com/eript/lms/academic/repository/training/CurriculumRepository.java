package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.Curriculum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {

    Optional<Curriculum> findByCode(String code);

    List<Curriculum> findAllByProgramId(Long programId);
}
