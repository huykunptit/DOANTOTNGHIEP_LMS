package com.eript.lms.auth.dto.request;

public record ResetPasswordRequest(String token, String newPassword) {
}
