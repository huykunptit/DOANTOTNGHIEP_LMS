package com.eript.lms.auth.dto.request;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateProfileRequest(
        @Size(min = 2, max = 255, message = "Tên phải từ 2 đến 255 ký tự")
        String name,

        @Size(max = 30, message = "Số điện thoại tối đa 30 ký tự")
        String phone,

        @Size(max = 500, message = "Tiểu sử tối đa 500 ký tự")
        String bio,

        @Size(max = 255, message = "Avatar URL tối đa 255 ký tự")
        String avatar,

        @Size(max = 20, message = "Giới tính tối đa 20 ký tự")
        String gender,

        LocalDate dateOfBirth,

        @Size(max = 255, message = "Quê quán tối đa 255 ký tự")
        String hometown,

        @Size(max = 500, message = "Địa chỉ thường trú tối đa 500 ký tự")
        String permanentAddress
) {
}
