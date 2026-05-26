package com.eript.academic.repository.organization;

import com.eript.academic.entity.organization.UserAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAssignmentRepository extends JpaRepository<UserAssignment, Long> {

    List<UserAssignment> findAllByUserId(Long userId);

    List<UserAssignment> findAllByUnitId(Long unitId);

    List<UserAssignment> findAllByActiveTrue();
}
