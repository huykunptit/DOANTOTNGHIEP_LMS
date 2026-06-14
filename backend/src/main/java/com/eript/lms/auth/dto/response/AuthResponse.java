package com.eript.lms.auth.dto.response;

import java.util.Set;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        Long userId,
        String name,
        String email,
        Set<String> roles
) {
}
