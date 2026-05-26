package com.eript.academic.repository.organization;

import com.eript.academic.entity.organization.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {

    Optional<Unit> findByCode(String code);

    List<Unit> findAllByInstitutionId(Long institutionId);

    List<Unit> findAllByParentId(Long parentId);
}
