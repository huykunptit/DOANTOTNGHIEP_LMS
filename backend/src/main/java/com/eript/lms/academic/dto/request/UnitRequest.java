package com.eript.lms.academic.dto.request;

public record UnitRequest(
        Long institutionId,
        Long parentId,
        String code,
        String name,
        Integer level,
        String type,
        Boolean active
) {
}
