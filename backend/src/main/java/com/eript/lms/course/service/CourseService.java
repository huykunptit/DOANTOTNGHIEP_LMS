package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {

    CourseResponse create(CourseRequest request);

    CourseResponse update(Long id, CourseRequest request);

    CourseResponse getById(Long id);

    org.springframework.data.domain.Page<CourseResponse> getAll(String search, org.springframework.data.domain.Pageable pageable);

    void enroll(Long courseId, Long userId);
    List<CourseResponse> getEnrolledCourses(Long userId);
    List<CourseResponse> getInstructorCourses(Long instructorId);

    void delete(Long id);
}
