package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.SectionRequest;
import com.eript.lms.course.dto.response.SectionResponse;
import com.eript.lms.course.entity.content.Course;
import com.eript.lms.course.entity.content.Section;
import com.eript.lms.course.mapper.SectionMapper;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.repository.SectionRepository;
import com.eript.lms.course.service.SectionService;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;
    private final SectionMapper sectionMapper;
    private final com.eript.lms.course.repository.LessonProgressRepository progressRepository;

    @Override
    @Transactional
    public SectionResponse createSection(SectionRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", request.getCourseId()));

        Section section = sectionMapper.toEntity(request);
        section.setCourse(course);
        
        // Auto assign position if null
        if (section.getPosition() == null) {
            long count = sectionRepository.findByCourseIdOrderByPositionAsc(course.getId()).size();
            section.setPosition((int) count + 1);
        }

        return sectionMapper.toResponse(sectionRepository.save(section));
    }

    @Override
    @Transactional
    public SectionResponse updateSection(Long id, SectionRequest request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", id));

        sectionMapper.updateEntity(request, section);
        return sectionMapper.toResponse(sectionRepository.save(section));
    }

    @Override
    @Transactional
    public void deleteSection(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section", id));
        sectionRepository.delete(section);
    }

    @Override
    public List<SectionResponse> getSectionsByCourseId(Long courseId, Long userId) {
        List<SectionResponse> responses = sectionRepository.findByCourseIdOrderByPositionAsc(courseId).stream()
                .map(sectionMapper::toResponse)
                .toList();
                
        if (userId != null) {
            java.util.List<com.eript.lms.course.entity.LessonProgress> progresses = 
                progressRepository.findByUserIdAndLesson_Section_CourseId(userId, courseId);
            java.util.Map<Long, Boolean> completionMap = progresses.stream()
                .collect(java.util.stream.Collectors.toMap(p -> p.getLesson().getId(), p -> java.util.Optional.ofNullable(p.getCompleted()).orElse(false)));
            
            for (SectionResponse section : responses) {
                if (section.getLessons() != null) {
                    for (com.eript.lms.course.dto.response.LessonResponse lesson : section.getLessons()) {
                        lesson.setIsCompleted(completionMap.getOrDefault(lesson.getId(), false));
                    }
                }
            }
        }
        return responses;
    }
}
