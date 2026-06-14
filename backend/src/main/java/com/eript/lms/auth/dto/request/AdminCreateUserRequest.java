package com.eript.lms.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record AdminCreateUserRequest(
        @NotBlank @Size(min = 2, max = 255) String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotBlank @Size(max = 50) String userType,
        String phone,
        String studentCode,
        String staffCode,
        String studyStatus,
        Boolean active,
        @NotEmpty Set<String> roles
) {
}
