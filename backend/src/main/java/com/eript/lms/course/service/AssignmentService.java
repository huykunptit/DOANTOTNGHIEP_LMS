package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentGradeRequest;
import com.eript.lms.course.dto.request.AssignmentDtos.AssignmentSubmitRequest;
import com.eript.lms.course.entity.assignment.AssignmentSubmission;
import com.eript.lms.course.entity.assignment.LessonAssignment;

import java.util.List;

public interface AssignmentService {
    LessonAssignment getAssignmentByLesson(Long lessonId);
    AssignmentSubmission submitAssignment(Long assignmentId, Long userId, AssignmentSubmitRequest request);
    AssignmentSubmission gradeAssignment(Long submissionId, Long teacherId, AssignmentGradeRequest request);
    List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId);
    AssignmentSubmission getStudentSubmission(Long assignmentId, Long userId);
}
