package com.eript.lms.course.service;

import com.eript.lms.course.dto.response.GradebookDtos.GradebookResponse;

public interface GradebookService {
    GradebookResponse getStudentGradebook(Long courseId, Long userId);
}
