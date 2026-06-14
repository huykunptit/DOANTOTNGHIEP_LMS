package com.eript.lms.auth.controller;

import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.course.repository.CourseEnrollmentRepository;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.auth.repository.auth.LoginAuditRepository;
import com.eript.lms.payment.entity.Order;
import com.eript.lms.payment.repository.OrderRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Tag(name = "Admin - Dashboard", description = "Admin dashboard statistics")
@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long totalUsers = userRepository.count();
        long activeCourses = courseRepository.countByActive(true);
        long totalEnrollments = enrollmentRepository.count();

        BigDecimal totalRevenue = orderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getStatus()))
                .map(o -> o.getAmount() != null ? o.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "totalUsers", totalUsers,
                "activeCourses", activeCourses,
                "totalEnrollments", totalEnrollments,
                "totalRevenue", totalRevenue
        );
    }

    @GetMapping("/recent-users")
    public List<?> recentUsers() {
        return userRepository.findAll(
                PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "id"))
        ).getContent().stream().map(u -> Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "userType", u.getUserType() != null ? u.getUserType() : "",
                "active", Boolean.TRUE.equals(u.getActive()),
                "roles", u.getRoles().stream().map(r -> r.getName()).toList()
        )).toList();
    }

    @GetMapping("/orders")
    public List<Order> allOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/recent-logins")
    public List<?> recentLogins() {
        return loginAuditRepository.findAll(
                PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent().stream().map(a -> Map.of(
                "email", a.getEmail(),
                "success", Boolean.TRUE.equals(a.getSuccess()),
                "createdAt", a.getCreatedAt().toString(),
                "failureReason", a.getFailureReason() != null ? a.getFailureReason() : ""
        )).toList();
    }
}
