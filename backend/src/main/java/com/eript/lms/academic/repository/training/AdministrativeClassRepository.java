package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.AdministrativeClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministrativeClassRepository extends JpaRepository<AdministrativeClass, Long> {

    Optional<AdministrativeClass> findByCode(String code);

    List<AdministrativeClass> findAllByCohortId(Long cohortId);
}
