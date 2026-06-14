package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.SectionRequest;
import com.eript.lms.course.dto.response.SectionResponse;

import java.util.List;

public interface SectionService {
    SectionResponse createSection(SectionRequest request);
    SectionResponse updateSection(Long id, SectionRequest request);
    void deleteSection(Long id);
    List<SectionResponse> getSectionsByCourseId(Long courseId, Long userId);
}
