package com.eript.lms.course.mapper;

import com.eript.lms.course.dto.request.SectionRequest;
import com.eript.lms.course.dto.response.SectionResponse;
import com.eript.lms.course.entity.content.Section;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {LessonMapper.class})
public interface SectionMapper {

    @Mapping(target = "courseId", source = "course.id")
    SectionResponse toResponse(Section section);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    Section toEntity(SectionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "lessons", ignore = true)
    void updateEntity(SectionRequest request, @MappingTarget Section section);
}
