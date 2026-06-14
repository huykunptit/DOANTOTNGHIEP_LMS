package com.eript.lms.course.mapper;

import com.eript.lms.course.dto.request.LessonRequest;
import com.eript.lms.course.dto.response.LessonResponse;
import com.eript.lms.course.entity.content.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "sectionId", source = "section.id")
    LessonResponse toResponse(Lesson lesson);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "section", ignore = true)
    @Mapping(target = "videoSize", ignore = true)
    @Mapping(target = "videoStatus", ignore = true)
    @Mapping(target = "progressEntries", ignore = true)
    Lesson toEntity(LessonRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "section", ignore = true)
    @Mapping(target = "videoSize", ignore = true)
    @Mapping(target = "videoStatus", ignore = true)
    @Mapping(target = "progressEntries", ignore = true)
    void updateEntity(LessonRequest request, @MappingTarget Lesson lesson);
}
