package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentGradeRequest;
import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentSubmitRequest;
import com.eript.lms.course.entity.assignment.AssignmentSubmission;
import com.eript.lms.course.entity.assignment.LessonAssignment;
import com.eript.lms.course.repository.assignment.AssignmentSubmissionRepository;
import com.eript.lms.course.repository.assignment.LessonAssignmentRepository;
import com.eript.lms.course.service.AssignmentService;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final LessonAssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;

    @Override
    @Transactional(readOnly = true)
    public LessonAssignment getAssignmentByLesson(Long lessonId) {
        return assignmentRepository.findByLessonId(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found for lesson: " + lessonId));
    }

    @Override
    public AssignmentSubmission submitAssignment(Long assignmentId, Long userId, AssignmentSubmitRequest request) {
        LessonAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        if (assignment.getDueDate() != null && LocalDateTime.now().isAfter(assignment.getDueDate()) && !assignment.getAllowLateSubmission()) {
            throw new IllegalArgumentException("Assignment is past due date and late submissions are not allowed.");
        }

        AssignmentSubmission submission = submissionRepository.findByAssignmentIdAndUserId(assignmentId, userId)
                .orElseGet(() -> AssignmentSubmission.builder()
                        .assignment(assignment)
                        .userId(userId)
                        .build());

        submission.setFileUrl(request.getFileUrl());
        submission.setContent(request.getContent());
        submission.setStatus("SUBMITTED");
        submission.setSubmittedAt(LocalDateTime.now());

        if (assignment.getDueDate() != null && LocalDateTime.now().isAfter(assignment.getDueDate())) {
            submission.setStatus("LATE");
        }

        return submissionRepository.save(submission);
    }

    @Override
    public AssignmentSubmission gradeAssignment(Long submissionId, Long teacherId, AssignmentGradeRequest request) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));

        submission.setScore(request.getScore());
        submission.setFeedback(request.getFeedback());
        submission.setStatus("GRADED");
        submission.setGradedAt(LocalDateTime.now());
        submission.setGradedBy(teacherId);

        return submissionRepository.save(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentSubmission getStudentSubmission(Long assignmentId, Long userId) {
        return submissionRepository.findByAssignmentIdAndUserId(assignmentId, userId).orElse(null);
    }
}
