package com.eript.lms.course.mapper;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;
import com.eript.lms.course.entity.content.Course;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    CourseResponse toResponse(Course course);

    Course toEntity(CourseRequest request);

    void updateEntity(CourseRequest request, @MappingTarget Course course);
}
