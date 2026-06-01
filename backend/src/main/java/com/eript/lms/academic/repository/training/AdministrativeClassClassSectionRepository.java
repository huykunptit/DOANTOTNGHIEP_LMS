package com.eript.lms.academic.repository.training;

import com.eript.lms.academic.entity.training.AdministrativeClassClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministrativeClassClassSectionRepository extends JpaRepository<AdministrativeClassClassSection, Long> {

    List<AdministrativeClassClassSection> findAllByAdministrativeClassId(Long administrativeClassId);

    List<AdministrativeClassClassSection> findAllByClassSectionId(Long classSectionId);
}
