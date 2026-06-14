package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;
import com.eript.lms.course.entity.content.Course;
import com.eript.lms.course.mapper.CourseMapper;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.service.CourseService;
import com.eript.lms.exception.ResourceNotFoundException;
import com.eript.lms.notification.dto.request.NotificationRequest;
import com.eript.lms.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final com.eript.lms.course.repository.CourseEnrollmentRepository enrollmentRepository;
    private final NotificationService notificationService;

    @Override
    public CourseResponse create(CourseRequest request) {
        Course course = courseMapper.toEntity(request);
        if (request.active() == null) course.setActive(false);
        if (course.getSlug() == null || course.getSlug().isBlank()) {
            course.setSlug(slugify(request.code() + "-" + request.title()));
        }
        return courseMapper.toResponse(courseRepository.save(course));
    }

    private String slugify(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\u00C0-\\u1EF9]+", "-")
                .replaceAll("(^-|-$)", "");
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
    public Page<CourseResponse> getAll(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return courseRepository.findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCase(search, search, pageable)
                    .map(courseMapper::toResponse);
        }
        return courseRepository.findAll(pageable).map(courseMapper::toResponse);
    }

    @Override
    public void delete(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public void enroll(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        if (enrollmentRepository.existsByCourseIdAndUserId(courseId, userId)) {
            throw new IllegalArgumentException("User is already enrolled in this course");
        }

        com.eript.lms.course.entity.CourseEnrollment enrollment = com.eript.lms.course.entity.CourseEnrollment.builder()
                .course(course)
                .userId(userId)
                .status("ACTIVE")
                .progressPercent(0)
                .enrolledAt(LocalDateTime.now())
                .build();
        enrollmentRepository.save(enrollment);

        notificationService.create(new NotificationRequest(
                userId, "ENROLLMENT",
                "Đăng ký khóa học thành công",
                "Bạn đã đăng ký thành công khóa học: " + course.getTitle(),
                "/student/courses/" + courseId
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getEnrolledCourses(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(enrollment -> courseMapper.toResponse(enrollment.getCourse()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponse> getInstructorCourses(Long instructorId) {
        return courseRepository.findByUserId(instructorId).stream()
                .map(courseMapper::toResponse)
                .toList();
    }
}
