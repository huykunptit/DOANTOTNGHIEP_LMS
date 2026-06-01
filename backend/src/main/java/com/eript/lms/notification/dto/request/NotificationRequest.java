package com.eript.lms.notification.dto.request;

public record NotificationRequest(
        Long userId,
        String type,
        String title,
        String message,
        String link
) {
}
