package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.LessonRequest;
import com.eript.lms.course.dto.response.LessonResponse;

import java.util.List;

public interface LessonService {
    LessonResponse createLesson(LessonRequest request);
    LessonResponse updateLesson(Long id, LessonRequest request);
    void deleteLesson(Long id);
    List<LessonResponse> getLessonsBySectionId(Long sectionId);
    void tickProgress(Long lessonId, Long userId);
}
