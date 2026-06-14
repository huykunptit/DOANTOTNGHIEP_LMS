package com.eript.lms.course.controller;

import com.eript.lms.course.dto.response.CourseResponse;
import com.eript.lms.course.entity.CourseEnrollment;
import com.eript.lms.course.entity.assignment.AssignmentSubmission;
import com.eript.lms.course.repository.CourseEnrollmentRepository;
import com.eript.lms.course.repository.assignment.AssignmentSubmissionRepository;
import com.eript.lms.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
public class InstructorController {

    private final CourseService courseService;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getInstructorCourses() {
        return ResponseEntity.ok(courseService.getInstructorCourses(currentUserId()));
    }

    @GetMapping("/courses/{courseId}/students")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<List<CourseEnrollment>> getEnrolledStudents(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentRepository.findByCourseId(courseId));
    }

    @GetMapping("/courses/{courseId}/assignments")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getCourseSubmissions(@PathVariable Long courseId) {
        return ResponseEntity.ok(submissionRepository.findByAssignment_Lesson_Section_Course_Id(courseId));
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
