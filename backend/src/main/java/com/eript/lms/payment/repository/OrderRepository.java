package com.eript.lms.payment.repository;

import com.eript.lms.payment.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Order> findByOrderCode(Long orderCode);

    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, String status);
}
