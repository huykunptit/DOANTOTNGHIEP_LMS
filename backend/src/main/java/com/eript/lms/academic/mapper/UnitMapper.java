package com.eript.lms.academic.mapper;

import com.eript.lms.academic.dto.request.UnitRequest;
import com.eript.lms.academic.dto.response.UnitResponse;
import com.eript.lms.academic.entity.organization.Unit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UnitMapper {

    @Mapping(target = "institutionId", source = "institution.id")
    @Mapping(target = "parentId", source = "parent.id")
    UnitResponse toResponse(Unit unit);

    @Mapping(target = "institution", ignore = true)
    @Mapping(target = "parent", ignore = true)
    Unit toEntity(UnitRequest request);

    @Mapping(target = "institution", ignore = true)
    @Mapping(target = "parent", ignore = true)
    void updateEntity(UnitRequest request, @MappingTarget Unit unit);
}
