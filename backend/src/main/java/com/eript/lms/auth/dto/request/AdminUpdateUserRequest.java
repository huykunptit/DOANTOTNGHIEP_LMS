package com.eript.lms.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record AdminUpdateUserRequest(
        @Size(min = 2, max = 255) String name,
        @Email String email,
        @Size(max = 50) String userType,
        String phone,
        String studentCode,
        String staffCode,
        String studyStatus,
        Boolean active,
        Set<String> roles
) {
}
