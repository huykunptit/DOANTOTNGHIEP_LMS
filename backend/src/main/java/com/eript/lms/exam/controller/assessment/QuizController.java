package com.eript.lms.exam.controller.assessment;

import com.eript.lms.exam.dto.request.QuestionRequest;
import com.eript.lms.exam.dto.request.QuizRequest;
import com.eript.lms.exam.dto.request.QuizSubmitRequest;
import com.eript.lms.exam.dto.response.QuestionResponse;
import com.eript.lms.exam.dto.response.QuizAttemptResponse;
import com.eript.lms.exam.dto.response.QuizResponse;
import com.eript.lms.exam.repository.assessment.QuizAttemptRepository;
import com.eript.lms.exam.service.assessment.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;
    private final QuizAttemptRepository quizAttemptRepository;

    @PostMapping
    public ResponseEntity<QuizResponse> createQuiz(@Valid @RequestBody QuizRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.createQuiz(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponse> getQuizForTeacher(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuiz(id, false));
    }

    @GetMapping("/{id}/student")
    public ResponseEntity<QuizResponse> getQuizForStudent(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuiz(id, true));
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<QuestionResponse> addQuestionToQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quizService.addQuestionToQuiz(id, request));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizAttemptResponse> submitQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizSubmitRequest request) {
        return ResponseEntity.ok(quizService.submitQuiz(id, currentUserId(), request));
    }

    @GetMapping("/{id}/my-attempts")
    public ResponseEntity<List<QuizAttemptResponse>> getMyAttempts(@PathVariable Long id) {
        Long userId = currentUserId();
        List<QuizAttemptResponse> attempts = quizAttemptRepository
                .findByQuizIdAndUserIdOrderByStartedAtDesc(id, userId)
                .stream()
                .map(a -> new QuizAttemptResponse(
                        a.getId(), a.getQuizId(), a.getUserId(),
                        a.getScore(), a.getPassed(), a.getStartedAt(), a.getCompletedAt()))
                .toList();
        return ResponseEntity.ok(attempts);
    }

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
