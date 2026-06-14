package com.eript.lms.course.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CourseRequest(
        @NotBlank(message = "Mã khóa học không được để trống")
        @Size(max = 50, message = "Mã khóa học tối đa 50 ký tự")
        String code,

        // slug is optional — auto-generated from title+code if absent
        @Size(max = 255)
        String slug,

        @NotBlank(message = "Tên khóa học không được để trống")
        @Size(max = 255, message = "Tên khóa học tối đa 255 ký tự")
        String title,

        String description,
        String thumbnail,

        @Min(value = 0, message = "Giá không được nhỏ hơn 0")
        BigDecimal price,

        String status,
        Long categoryId,
        Long userId,
        String courseMode,
        Boolean creditBearing,
        Integer creditValue,
        Long programTypeId,
        Long programId,
        Long majorId,
        Long curriculumId,
        Long certificateTemplateId,
        Boolean active
) {}
