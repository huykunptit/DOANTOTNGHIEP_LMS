package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {

    Optional<Term> findByCode(String code);

    List<Term> findAllByAcademicYearId(Long academicYearId);
}
