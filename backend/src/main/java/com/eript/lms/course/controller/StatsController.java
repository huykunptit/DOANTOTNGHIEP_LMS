package com.eript.lms.course.controller;

import com.eript.lms.course.repository.CourseEnrollmentRepository;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.repository.LessonProgressRepository;
import com.eript.lms.course.repository.assignment.AssignmentSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class StatsController {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final CourseRepository courseRepository;
    private final AssignmentSubmissionRepository submissionRepository;

    @GetMapping("/student/stats")
    public Map<String, Long> studentStats() {
        Long userId = currentUserId();
        long enrolled = enrollmentRepository.countByUserId(userId);
        long completedLessons = lessonProgressRepository.countByUserIdAndCompleted(userId, true);
        long pendingLessons = lessonProgressRepository.countByUserIdAndCompleted(userId, false);
        return Map.of(
                "enrolledCourses", enrolled,
                "completedLessons", completedLessons,
                "inProgressLessons", pendingLessons
        );
    }

    @GetMapping("/instructor/stats")
    public Map<String, Long> instructorStats() {
        Long userId = currentUserId();
        long courses = courseRepository.findByUserId(userId).size();
        long totalStudents = courseRepository.findByUserId(userId).stream()
                .mapToLong(c -> enrollmentRepository.countByCourseId(c.getId()))
                .sum();
        long pendingSubmissions = courseRepository.findByUserId(userId).stream()
                .flatMap(c -> submissionRepository.findByAssignment_Lesson_Section_Course_Id(c.getId()).stream())
                .filter(s -> "SUBMITTED".equals(s.getStatus()))
                .count();
        return Map.of(
                "totalCourses", courses,
                "totalStudents", totalStudents,
                "pendingGrading", pendingSubmissions
        );
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
