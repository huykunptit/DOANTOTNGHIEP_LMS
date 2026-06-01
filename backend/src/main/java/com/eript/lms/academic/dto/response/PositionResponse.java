package com.eript.lms.academic.dto.response;

public record PositionResponse(
        Long id,
        String code,
        String name,
        String scopeLevel,
        String description,
        Boolean active
) {
}
