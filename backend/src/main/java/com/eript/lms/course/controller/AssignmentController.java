package com.eript.lms.course.controller;

import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentGradeRequest;
import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentSubmitRequest;
import com.eript.lms.course.entity.assignment.AssignmentSubmission;
import com.eript.lms.course.entity.assignment.LessonAssignment;
import com.eript.lms.course.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<LessonAssignment> getAssignmentByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(assignmentService.getAssignmentByLesson(lessonId));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            @PathVariable Long id,
            @RequestBody AssignmentSubmitRequest request) {
        return ResponseEntity.ok(assignmentService.submitAssignment(id, currentUserId(), request));
    }

    @PostMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<AssignmentSubmission> gradeAssignment(
            @PathVariable Long submissionId,
            @RequestBody AssignmentGradeRequest request) {
        return ResponseEntity.ok(assignmentService.gradeAssignment(submissionId, currentUserId(), request));
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<AssignmentSubmission>> getSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getSubmissionsByAssignment(id));
    }

    @GetMapping("/{id}/my-submission")
    public ResponseEntity<AssignmentSubmission> getMySubmission(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getStudentSubmission(id, currentUserId()));
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
