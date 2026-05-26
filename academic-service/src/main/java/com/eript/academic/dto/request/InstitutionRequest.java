package com.eript.academic.dto.request;

public record InstitutionRequest(
        String code,
        String name,
        String shortName,
        String description,
        Boolean active
) {
}
