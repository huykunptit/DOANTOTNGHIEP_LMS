package com.eript.lms.course.controller;

import com.eript.lms.course.dto.request.CourseRequest;
import com.eript.lms.course.dto.response.CourseResponse;
import com.eript.lms.course.dto.response.SectionResponse;
import com.eript.lms.course.service.CourseService;
import com.eript.lms.course.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final SectionService sectionService;

    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(request));
    }

    @PutMapping("/{id}")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return courseService.update(id, request);
    }

    @GetMapping("/{id}")
    public CourseResponse getById(@PathVariable Long id) {
        return courseService.getById(id);
    }

    @GetMapping
    public Page<CourseResponse> getAll(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return courseService.getAll(search, pageable);
    }

    @GetMapping("/{id}/content")
    public List<SectionResponse> getCourseContent(@PathVariable Long id) {
        Long userId = currentUserId();
        return sectionService.getSectionsByCourseId(id, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/enroll")
    public ResponseEntity<Void> enrollCourse(@PathVariable Long id) {
        courseService.enroll(id, currentUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/enrolled")
    public ResponseEntity<List<CourseResponse>> getEnrolledCourses() {
        return ResponseEntity.ok(courseService.getEnrolledCourses(currentUserId()));
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
