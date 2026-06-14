package com.eript.lms.auth.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String userType,
        String phone,
        String studentCode,
        String staffCode,
        String studyStatus,
        Boolean active,
        LocalDateTime emailVerifiedAt,
        Set<String> roles
) {
}
