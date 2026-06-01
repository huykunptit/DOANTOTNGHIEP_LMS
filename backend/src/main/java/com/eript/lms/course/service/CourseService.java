package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {

    CourseResponse create(CourseRequest request);

    CourseResponse update(Long id, CourseRequest request);

    CourseResponse getById(Long id);

    List<CourseResponse> getAll();

    void delete(Long id);
}
