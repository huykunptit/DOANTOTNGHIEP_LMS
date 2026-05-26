package com.eript.academic.repository.training;

import com.eript.academic.entity.training.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Long> {

    Optional<Specialization> findByCode(String code);

    List<Specialization> findAllByMajorId(Long majorId);
}
