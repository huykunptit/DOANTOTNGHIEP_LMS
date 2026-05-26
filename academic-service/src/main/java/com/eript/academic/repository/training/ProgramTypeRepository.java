package com.eript.academic.repository.training;

import com.eript.academic.entity.training.ProgramType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgramTypeRepository extends JpaRepository<ProgramType, Long> {

    Optional<ProgramType> findByCode(String code);

    boolean existsByCode(String code);
}
