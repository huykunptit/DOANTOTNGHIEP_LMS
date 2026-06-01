package com.eript.lms.course.dto.response;

import java.math.BigDecimal;

public record CourseResponse(
        Long id,
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
