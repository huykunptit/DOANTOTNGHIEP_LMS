package com.eript.lms.course.controller;

import com.eript.lms.auth.repository.auth.UserRepository;
import com.eript.lms.course.dto.request.ForumDtos.QAReplyRequest;
import com.eript.lms.course.dto.request.ForumDtos.QARequest;
import com.eript.lms.course.dto.response.ForumQAResponse;
import com.eript.lms.course.entity.forum.CourseQA;
import com.eript.lms.course.entity.forum.CourseQAReply;
import com.eript.lms.course.repository.forum.CourseQAReplyRepository;
import com.eript.lms.course.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final CourseQAReplyRepository replyRepository;
    private final UserRepository userRepository;

    @PostMapping("/course/{courseId}")
    public ResponseEntity<CourseQA> postQuestion(
            @PathVariable Long courseId,
            @RequestBody QARequest request) {
        return ResponseEntity.ok(forumService.createQuestion(courseId, currentUserId(), request));
    }

    @PostMapping("/qa/{qaId}/reply")
    public ResponseEntity<CourseQAReply> replyQuestion(
            @PathVariable Long qaId,
            @RequestBody QAReplyRequest request) {
        boolean isInstructor = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().contains(new SimpleGrantedAuthority("ROLE_INSTRUCTOR"))
                || SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return ResponseEntity.ok(forumService.replyQuestion(qaId, currentUserId(), request, isInstructor));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<Page<ForumQAResponse>> getQuestionsByCourse(
            @PathVariable Long courseId,
            Pageable pageable) {
        Page<CourseQA> page = forumService.getQuestionsByCourse(courseId, pageable);

        // Build userId → name map
        List<Long> userIds = page.getContent().stream().map(CourseQA::getUserId).distinct().toList();
        Map<Long, String> nameMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(u -> u.getId(), u -> u.getName() != null ? u.getName() : u.getEmail()));

        // Enrich with first instructor reply and reply count
        List<ForumQAResponse> enriched = page.getContent().stream().map(qa -> {
            List<CourseQAReply> replies = replyRepository.findByQaIdOrderByCreatedAtAsc(qa.getId());
            String instructorReply = replies.stream()
                    .filter(r -> Boolean.TRUE.equals(r.getIsInstructorReply()))
                    .findFirst()
                    .map(CourseQAReply::getContent)
                    .orElse(null);
            return ForumQAResponse.builder()
                    .id(qa.getId())
                    .userId(qa.getUserId())
                    .authorName(nameMap.getOrDefault(qa.getUserId(), "Sinh viên"))
                    .title(qa.getTitle())
                    .content(qa.getContent())
                    .isResolved(qa.getIsResolved())
                    .lessonId(qa.getLesson() != null ? qa.getLesson().getId() : null)
                    .instructorReply(instructorReply)
                    .replyCount(replies.size())
                    .createdAt(qa.getCreatedAt())
                    .build();
        }).toList();

        return ResponseEntity.ok(new PageImpl<>(enriched, page.getPageable(), page.getTotalElements()));
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<ForumQAResponse>> getQuestionsByLesson(@PathVariable Long lessonId) {
        List<CourseQA> questions = forumService.getQuestionsByLesson(lessonId);

        List<Long> userIds = questions.stream().map(CourseQA::getUserId).distinct().toList();
        Map<Long, String> nameMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(u -> u.getId(), u -> u.getName() != null ? u.getName() : u.getEmail()));

        List<ForumQAResponse> enriched = questions.stream().map(qa -> {
            List<CourseQAReply> replies = replyRepository.findByQaIdOrderByCreatedAtAsc(qa.getId());
            String instructorReply = replies.stream()
                    .filter(r -> Boolean.TRUE.equals(r.getIsInstructorReply()))
                    .findFirst()
                    .map(CourseQAReply::getContent)
                    .orElse(null);
            return ForumQAResponse.builder()
                    .id(qa.getId())
                    .userId(qa.getUserId())
                    .authorName(nameMap.getOrDefault(qa.getUserId(), "Sinh viên"))
                    .title(qa.getTitle())
                    .content(qa.getContent())
                    .isResolved(qa.getIsResolved())
                    .lessonId(qa.getLesson() != null ? qa.getLesson().getId() : null)
                    .instructorReply(instructorReply)
                    .replyCount(replies.size())
                    .createdAt(qa.getCreatedAt())
                    .build();
        }).toList();

        return ResponseEntity.ok(enriched);
    }

    @GetMapping("/qa/{qaId}/replies")
    public ResponseEntity<List<CourseQAReply>> getReplies(@PathVariable Long qaId) {
        return ResponseEntity.ok(forumService.getRepliesByQuestion(qaId));
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
