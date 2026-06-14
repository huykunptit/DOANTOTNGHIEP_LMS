package com.eript.lms.course.controller;

import com.eript.lms.course.dto.response.GradebookDtos.GradebookResponse;
import com.eript.lms.course.service.GradebookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gradebook")
@RequiredArgsConstructor
public class GradebookController {

    private final GradebookService gradebookService;

    @GetMapping("/course/{courseId}/my-grades")
    public ResponseEntity<GradebookResponse> getMyGrades(@PathVariable Long courseId) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(gradebookService.getStudentGradebook(courseId, userId));
    }
}
