package com.eript.lms.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Tên không được để trống")
        @Size(min = 2, max = 255, message = "Tên phải từ 2 đến 255 ký tự")
        String name,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự")
        String password
) {
}
