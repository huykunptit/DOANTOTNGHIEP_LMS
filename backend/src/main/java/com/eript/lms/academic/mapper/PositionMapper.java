package com.eript.lms.academic.mapper;

import com.eript.lms.academic.dto.request.PositionRequest;
import com.eript.lms.academic.dto.response.PositionResponse;
import com.eript.lms.academic.entity.organization.Position;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PositionMapper {

    PositionResponse toResponse(Position position);

    Position toEntity(PositionRequest request);

    void updateEntity(PositionRequest request, @MappingTarget Position position);
}
