package com.eript.lms.auth.dto.response;

import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        String email,
        String userType,
        Boolean active,
        Set<String> roles
) {
}
