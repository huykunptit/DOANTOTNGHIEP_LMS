package com.eript.lms.academic.dto.response;

public record UnitResponse(
        Long id,
        Long institutionId,
        Long parentId,
        String code,
        String name,
        Integer level,
        String type,
        Boolean active
) {
}
