package com.eript.lms.course.service.impl;

import com.eript.lms.course.dto.request.ForumDtos.QAReplyRequest;
import com.eript.lms.course.dto.request.ForumDtos.QARequest;
import com.eript.lms.course.entity.content.Course;
import com.eript.lms.course.entity.content.Lesson;
import com.eript.lms.course.entity.forum.CourseQA;
import com.eript.lms.course.entity.forum.CourseQAReply;
import com.eript.lms.course.repository.CourseRepository;
import com.eript.lms.course.repository.LessonRepository;
import com.eript.lms.course.repository.forum.CourseQAReplyRepository;
import com.eript.lms.course.repository.forum.CourseQARepository;
import com.eript.lms.course.service.ForumService;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ForumServiceImpl implements ForumService {

    private final CourseQARepository qaRepository;
    private final CourseQAReplyRepository replyRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public CourseQA createQuestion(Long courseId, Long userId, QARequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Lesson lesson = null;
        if (request.getLessonId() != null) {
            lesson = lessonRepository.findById(request.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
        }

        CourseQA qa = CourseQA.builder()
                .course(course)
                .lesson(lesson)
                .userId(userId)
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        return qaRepository.save(qa);
    }

    @Override
    public CourseQAReply replyQuestion(Long qaId, Long userId, QAReplyRequest request, boolean isInstructor) {
        CourseQA qa = qaRepository.findById(qaId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        CourseQAReply reply = CourseQAReply.builder()
                .qa(qa)
                .userId(userId)
                .content(request.getContent())
                .isInstructorReply(isInstructor)
                .build();

        return replyRepository.save(reply);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CourseQA> getQuestionsByCourse(Long courseId, Pageable pageable) {
        return qaRepository.findByCourseId(courseId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseQA> getQuestionsByLesson(Long lessonId) {
        return qaRepository.findByLessonId(lessonId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseQAReply> getRepliesByQuestion(Long qaId) {
        return replyRepository.findByQaIdOrderByCreatedAtAsc(qaId);
    }
}
