package com.eript.academic.repository.training;

import com.eript.academic.entity.training.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {

    Optional<Major> findByCode(String code);

    List<Major> findAllByProgramId(Long programId);
}
