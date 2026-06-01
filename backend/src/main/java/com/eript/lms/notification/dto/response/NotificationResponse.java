package com.eript.lms.notification.dto.response;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        Long userId,
        String type,
        String title,
        String message,
        String link,
        LocalDateTime readAt,
        LocalDateTime createdAt
) {
}
