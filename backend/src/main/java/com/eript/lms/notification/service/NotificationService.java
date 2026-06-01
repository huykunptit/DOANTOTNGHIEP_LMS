package com.eript.lms.notification.service;

import com.eript.lms.notification.dto.request.NotificationRequest;
import com.eript.lms.notification.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse create(NotificationRequest request);

    List<NotificationResponse> getByUserId(Long userId);

    long countUnread(Long userId);

    NotificationResponse markAsRead(Long id);

    void delete(Long id);
}
