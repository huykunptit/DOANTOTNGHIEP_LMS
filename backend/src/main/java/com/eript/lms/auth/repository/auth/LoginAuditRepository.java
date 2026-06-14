package com.eript.lms.auth.repository.auth;

import com.eript.lms.auth.entity.auth.LoginAudit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {

    Page<LoginAudit> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<LoginAudit> findByEmailOrderByCreatedAtDesc(String email, Pageable pageable);
}
