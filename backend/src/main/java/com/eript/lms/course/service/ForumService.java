package com.eript.lms.course.service;

import com.eript.lms.course.dto.request.ForumDtos.QAReplyRequest;
import com.eript.lms.course.dto.request.ForumDtos.QARequest;
import com.eript.lms.course.entity.forum.CourseQA;
import com.eript.lms.course.entity.forum.CourseQAReply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ForumService {
    CourseQA createQuestion(Long courseId, Long userId, QARequest request);
    CourseQAReply replyQuestion(Long qaId, Long userId, QAReplyRequest request, boolean isInstructor);
    Page<CourseQA> getQuestionsByCourse(Long courseId, Pageable pageable);
    List<CourseQA> getQuestionsByLesson(Long lessonId);
    List<CourseQAReply> getRepliesByQuestion(Long qaId);
}
