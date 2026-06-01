package com.eript.lms.course.dto.request;

import java.math.BigDecimal;

public record CourseRequest(
        String code,
        String slug,
        String title,
        String description,
        String thumbnail,
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
) {
}
