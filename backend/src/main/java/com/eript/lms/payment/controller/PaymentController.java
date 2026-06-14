package com.eript.lms.payment.controller;

import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.service.CourseService;
import com.eript.lms.exception.ResourceNotFoundException;
import com.eript.lms.payment.entity.Order;
import com.eript.lms.payment.repository.OrderRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Tag(name = "Payment", description = "Course payment via PayOS")
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderRepository orderRepository;
    private final CourseRepository courseRepository;
    private final CourseService courseService;

    @Value("${payos.client-id:}")
    private String payosClientId;

    @Value("${payos.api-key:}")
    private String payosApiKey;

    @Value("${app.frontend.base-url:http://localhost:3000}")
    private String frontendBaseUrl;

    @PostMapping("/checkout/{courseId}")
    public ResponseEntity<Map<String, Object>> checkout(@PathVariable Long courseId) {
        Long userId = currentUserId();

        if (orderRepository.existsByUserIdAndCourseIdAndStatus(userId, courseId, "PAID")) {
            throw new IllegalArgumentException("You have already purchased this course");
        }

        var course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        BigDecimal amount = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;

        // Free course → enroll directly
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            courseService.enroll(courseId, userId);
            return ResponseEntity.ok(Map.of(
                    "status", "FREE",
                    "message", "Đăng ký khóa học miễn phí thành công",
                    "courseId", courseId
            ));
        }

        // Paid course → create order + generate PayOS link
        long orderCode = System.currentTimeMillis() % 1_000_000_000L + new Random().nextInt(1000);

        Order order = Order.builder()
                .userId(userId)
                .courseId(courseId)
                .orderCode(orderCode)
                .amount(amount)
                .status("PENDING")
                .build();

        if (payosClientId != null && !payosClientId.isBlank()) {
            // Real PayOS integration would go here
            // For now, generate a mock checkout URL
            String checkoutUrl = buildPayOSLink(orderCode, amount, course.getTitle());
            order.setCheckoutUrl(checkoutUrl);
            order.setPaymentLinkId("mock-" + orderCode);
        }

        orderRepository.save(order);
        log.info("Created order {} for user {} course {}", orderCode, userId, courseId);

        return ResponseEntity.ok(Map.of(
                "status", "PENDING",
                "orderId", order.getId(),
                "orderCode", orderCode,
                "amount", amount,
                "checkoutUrl", order.getCheckoutUrl() != null ? order.getCheckoutUrl() : "",
                "currency", "VND"
        ));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> webhook(@RequestBody Map<String, Object> body) {
        log.info("PayOS webhook received: {}", body);
        Object codeObj = body.get("orderCode");
        Object statusObj = body.get("status");
        if (codeObj == null || statusObj == null) {
            return ResponseEntity.ok(Map.of("code", "00", "desc", "success"));
        }

        long orderCode = Long.parseLong(codeObj.toString());
        String status = statusObj.toString();

        orderRepository.findByOrderCode(orderCode).ifPresent(order -> {
            if ("PAID".equalsIgnoreCase(status)) {
                order.setStatus("PAID");
                order.setPaidAt(LocalDateTime.now());
                orderRepository.save(order);
                courseService.enroll(order.getCourseId(), order.getUserId());
                log.info("Payment confirmed for order {}, enrolling user {} in course {}",
                        orderCode, order.getUserId(), order.getCourseId());
            }
        });

        return ResponseEntity.ok(Map.of("code", "00", "desc", "success"));
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> myOrders() {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(currentUserId()));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
        return ResponseEntity.ok(order);
    }

    private String buildPayOSLink(long orderCode, BigDecimal amount, String description) {
        // Placeholder — replace with actual PayOS SDK call when keys are available
        return String.format("%s/payment/callback?orderCode=%d", frontendBaseUrl, orderCode);
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
