package com.eript.lms.exam.service.assessment;

import com.eript.lms.exam.dto.request.QuestionRequest;
import com.eript.lms.exam.dto.request.QuizRequest;
import com.eript.lms.exam.dto.request.QuizSubmitRequest;
import com.eript.lms.exam.dto.response.QuestionResponse;
import com.eript.lms.exam.dto.response.QuizAttemptResponse;
import com.eript.lms.exam.dto.response.QuizResponse;

public interface QuizService {
    QuizResponse createQuiz(QuizRequest request);
    QuizResponse getQuiz(Long id, boolean forStudent);
    QuestionResponse addQuestionToQuiz(Long quizId, QuestionRequest request);
    QuizAttemptResponse submitQuiz(Long quizId, Long userId, QuizSubmitRequest request);
}
