package com.eript.lms.auth.repository.auth;

import com.eript.lms.auth.entity.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByStudentCode(String studentCode);

    boolean existsByStaffCode(String staffCode);

    @Query("""
            SELECT DISTINCT u FROM User u
            LEFT JOIN u.roles r
            WHERE (:search IS NULL
                   OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(COALESCE(u.studentCode, '')) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(COALESCE(u.staffCode, '')) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:role IS NULL OR r.name = :role)
              AND (:active IS NULL OR u.active = :active)
            """)
    Page<User> searchUsers(@Param("search") String search,
                           @Param("role") String role,
                           @Param("active") Boolean active,
                           Pageable pageable);
}
