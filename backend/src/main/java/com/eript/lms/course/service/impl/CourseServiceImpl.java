package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;
import com.eript.lms.course.entity.content.Course;
import com.eript.lms.course.exception.ResourceNotFoundException;
import com.eript.lms.course.mapper.CourseMapper;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    @Override
    public CourseResponse create(CourseRequest request) {
        Course course = courseMapper.toEntity(request);
        if (request.active() == null) {
            course.setActive(true);
        }
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    public CourseResponse update(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
        courseMapper.updateEntity(request, course);
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getById(Long id) {
        return courseRepository.findById(id)
                .map(courseMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getAll() {
        return courseRepository.findAll().stream().map(courseMapper::toResponse).toList();
    }

    @Override
    public void delete(Long id) {
        courseRepository.deleteById(id);
    }
}
