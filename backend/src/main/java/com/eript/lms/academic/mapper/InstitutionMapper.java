package com.eript.lms.academic.mapper;

import com.eript.lms.academic.dto.request.InstitutionRequest;
import com.eript.lms.academic.dto.response.InstitutionResponse;
import com.eript.lms.academic.entity.organization.Institution;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface InstitutionMapper {

    InstitutionResponse toResponse(Institution institution);

    Institution toEntity(InstitutionRequest request);

    void updateEntity(InstitutionRequest request, @MappingTarget Institution institution);
}
