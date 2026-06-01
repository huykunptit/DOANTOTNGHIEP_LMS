package com.eript.lms.academic.dto.response;

public record InstitutionResponse(
        Long id,
        String code,
        String name,
        String shortName,
        String description,
        Boolean active
) {
}
