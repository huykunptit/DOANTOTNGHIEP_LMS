package com.eript.lms.auth.dto.response;

public record AuthResponse(String accessToken, String refreshToken, Long userId, String name, String email) {
}
