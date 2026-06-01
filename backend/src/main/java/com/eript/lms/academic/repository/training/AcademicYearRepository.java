package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findByCode(String code);

    boolean existsByCode(String code);
}
