package com.eript.lms.academic.dto.request;

public record PositionRequest(
        String code,
        String name,
        String scopeLevel,
        String description,
        Boolean active
) {
}
