package com.eript.lms.notification.mapper;

import com.eript.lms.notification.dto.request.NotificationRequest;
import com.eript.lms.notification.dto.response.NotificationResponse;
import com.eript.lms.notification.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationResponse toResponse(Notification notification);

    Notification toEntity(NotificationRequest request);

    void updateEntity(NotificationRequest request, @MappingTarget Notification notification);
}
