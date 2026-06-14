package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.LessonRequest;
import com.eript.lms.course.dto.response.LessonResponse;
import com.eript.lms.course.entity.content.Lesson;
import com.eript.lms.course.entity.content.Section;
import com.eript.lms.course.mapper.LessonMapper;
import com.eript.lms.course.repository.LessonRepository;
import com.eript.lms.course.repository.SectionRepository;
import com.eript.lms.course.service.LessonService;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final SectionRepository sectionRepository;
    private final LessonMapper lessonMapper;
    private final com.eript.lms.course.repository.LessonProgressRepository progressRepository;
    private final com.eript.lms.course.repository.assignment.LessonAssignmentRepository assignmentRepository;

    @Override
    @Transactional
    public LessonResponse createLesson(LessonRequest request) {
        Section section = sectionRepository.findById(request.getSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Section", request.getSectionId()));

        Lesson lesson = lessonMapper.toEntity(request);
        lesson.setSection(section);
        lesson.setCourse(section.getCourse()); // Inherit course from section
        
        // Auto assign orderIndex if null
        if (lesson.getOrderIndex() == null) {
            long count = lessonRepository.findBySectionIdOrderByOrderIndexAsc(section.getId()).size();
            lesson.setOrderIndex((int) count + 1);
        }

        Lesson savedLesson = lessonRepository.save(lesson);

        if ("ASSIGNMENT".equals(request.getType())) {
            com.eript.lms.course.entity.assignment.LessonAssignment assignment = 
                com.eript.lms.course.entity.assignment.LessonAssignment.builder()
                .lesson(savedLesson)
                .build();
            assignmentRepository.save(assignment);
        }

        return lessonMapper.toResponse(savedLesson);
    }

    @Override
    @Transactional
    public LessonResponse updateLesson(Long id, LessonRequest request) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", id));

        lessonMapper.updateEntity(request, lesson);
        return lessonMapper.toResponse(lessonRepository.save(lesson));
    }

    @Override
    @Transactional
    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", id));
        lessonRepository.delete(lesson);
    }

    @Override
    public List<LessonResponse> getLessonsBySectionId(Long sectionId) {
        return lessonRepository.findBySectionIdOrderByOrderIndexAsc(sectionId).stream()
                .map(lessonMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void tickProgress(Long lessonId, Long userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", lessonId));
                
        com.eript.lms.course.entity.LessonProgress progress = progressRepository.findByLessonIdAndUserId(lessonId, userId)
                .orElseGet(() -> com.eript.lms.course.entity.LessonProgress.builder()
                        .lesson(lesson)
                        .userId(userId)
                        .completed(false)
                        .progressPercent(0)
                        .build());

        // Toggle or set to true based on logic (Moodle usually toggles manual completion)
        // If it's a PDF/DOC, toggle. If it's Video/Quiz, maybe just set to true if it was false.
        // For simplicity, we just toggle manual completion or set to true.
        progress.setCompleted(!progress.getCompleted());
        progress.setCompletedAt(progress.getCompleted() ? java.time.LocalDateTime.now() : null);
        
        progressRepository.save(progress);
    }
}
