package com.eript.lms.exam.service.assessment.impl;

import com.eript.lms.exam.dto.request.AnswerRequest;
import com.eript.lms.exam.dto.request.QuestionRequest;
import com.eript.lms.exam.dto.request.QuizRequest;
import com.eript.lms.exam.dto.request.QuizSubmitRequest;
import com.eript.lms.exam.dto.response.AnswerResponse;
import com.eript.lms.exam.dto.response.QuestionResponse;
import com.eript.lms.exam.dto.response.QuizAttemptResponse;
import com.eript.lms.exam.dto.response.QuizResponse;
import com.eript.lms.exam.entity.assessment.Quiz;
import com.eript.lms.exam.entity.assessment.QuizAttempt;
import com.eript.lms.exam.entity.assessment.QuizQuestion;
import com.eript.lms.exam.entity.question.Answer;
import com.eript.lms.exam.entity.question.Question;
import com.eript.lms.exam.entity.question.QuestionBank;
import com.eript.lms.exam.mapper.QuizMapper;
import com.eript.lms.exam.repository.assessment.QuizAttemptRepository;
import com.eript.lms.exam.repository.assessment.QuizQuestionRepository;
import com.eript.lms.exam.repository.assessment.QuizRepository;
import com.eript.lms.exam.repository.question.AnswerRepository;
import com.eript.lms.exam.repository.question.QuestionBankRepository;
import com.eript.lms.exam.repository.question.QuestionRepository;
import com.eript.lms.exam.service.assessment.QuizService;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuestionBankRepository questionBankRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizMapper quizMapper;

    @Override
    public QuizResponse createQuiz(QuizRequest request) {
        Quiz quiz = Quiz.builder()
                .courseId(request.courseId())
                .lessonId(request.lessonId())
                .scope(request.scope())
                .title(request.title())
                .description(request.description())
                .timeLimit(request.timeLimit())
                .passScore(request.passScore() != null ? request.passScore() : BigDecimal.ZERO)
                .active(true)
                .build();
        quiz = quizRepository.save(quiz);
        return quizMapper.toResponse(quiz, List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public QuizResponse getQuiz(Long id, boolean forStudent) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", id));

        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderBySortOrderAsc(id);
        
        List<QuestionResponse> questionResponses = quizQuestions.stream().map(qq -> {
            Question q = qq.getQuestion();
            List<Answer> answers = answerRepository.findByQuestionIdOrderBySortOrderAsc(q.getId());
            List<AnswerResponse> answerResponses = answers.stream()
                    .map(a -> quizMapper.toAnswerResponse(a, forStudent))
                    .collect(Collectors.toList());
            return quizMapper.toQuestionResponse(q, answerResponses);
        }).collect(Collectors.toList());

        return quizMapper.toResponse(quiz, questionResponses);
    }

    @Override
    public QuestionResponse addQuestionToQuiz(Long quizId, QuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));

        // Get or create QuestionBank for the course
        QuestionBank bank = questionBankRepository.findByCourseId(quiz.getCourseId())
                .orElseGet(() -> {
                    QuestionBank newBank = QuestionBank.builder()
                            .courseId(quiz.getCourseId())
                            .name("Default Bank for Course " + quiz.getCourseId())
                            .active(true)
                            .build();
                    return questionBankRepository.save(newBank);
                });

        // Create Question
        Question question = Question.builder()
                .code(UUID.randomUUID().toString().substring(0, 8))
                .courseId(quiz.getCourseId())
                .questionBank(bank)
                .content(request.content())
                .type(request.type())
                .difficulty(request.difficulty())
                .defaultScore(request.defaultScore() != null ? request.defaultScore() : BigDecimal.ONE)
                .explanation(request.explanation())
                .active(true)
                .build();
        question = questionRepository.save(question);

        // Create Answers
        List<AnswerResponse> answerResponses = new ArrayList<>();
        int orderIndex = 1;
        for (AnswerRequest ar : request.answers()) {
            Answer answer = Answer.builder()
                    .question(question)
                    .content(ar.content())
                    .correct(ar.isCorrect())
                    .sortOrder(ar.orderIndex() != null ? ar.orderIndex() : orderIndex++)
                    .subContent(ar.explanation())
                    .build();
            answer = answerRepository.save(answer);
            answerResponses.add(quizMapper.toAnswerResponse(answer, false));
        }

        // Link Question to Quiz
        List<QuizQuestion> existingQQs = quizQuestionRepository.findByQuizIdOrderBySortOrderAsc(quizId);
        int nextOrder = existingQQs.size() + 1;
        
        QuizQuestion quizQuestion = QuizQuestion.builder()
                .quiz(quiz)
                .question(question)
                .points(question.getDefaultScore())
                .sortOrder(nextOrder)
                .build();
        quizQuestionRepository.save(quizQuestion);

        return quizMapper.toQuestionResponse(question, answerResponses);
    }

    @Override
    public QuizAttemptResponse submitQuiz(Long quizId, Long userId, QuizSubmitRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));
        
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderBySortOrderAsc(quizId);
        
        BigDecimal totalScore = BigDecimal.ZERO;
        BigDecimal maxPossibleScore = BigDecimal.ZERO;
        
        Map<Long, Long> studentAnswers = request.answers();

        for (QuizQuestion qq : quizQuestions) {
            Question q = qq.getQuestion();
            maxPossibleScore = maxPossibleScore.add(qq.getPoints() != null ? qq.getPoints() : BigDecimal.ZERO);
            
            Long submittedAnswerId = studentAnswers.get(q.getId());
            if (submittedAnswerId != null) {
                // Find if the submitted answer is correct
                List<Answer> correctAnswers = answerRepository.findByQuestionIdOrderBySortOrderAsc(q.getId())
                        .stream().filter(Answer::getCorrect).collect(Collectors.toList());
                
                // For Single Choice
                if (!correctAnswers.isEmpty() && correctAnswers.get(0).getId().equals(submittedAnswerId)) {
                    totalScore = totalScore.add(qq.getPoints() != null ? qq.getPoints() : BigDecimal.ZERO);
                }
            }
        }
        
        // Calculate percentage (scale to 100 for passScore comparison)
        BigDecimal percentage = BigDecimal.ZERO;
        if (maxPossibleScore.compareTo(BigDecimal.ZERO) > 0) {
            percentage = totalScore.multiply(new BigDecimal("100")).divide(maxPossibleScore, 2, java.math.RoundingMode.HALF_UP);
        }
        
        boolean passed = percentage.compareTo(quiz.getPassScore()) >= 0;

        QuizAttempt attempt = QuizAttempt.builder()
                .quizId(quiz.getId())
                .userId(userId)
                .startedAt(LocalDateTime.now().minusMinutes(quiz.getTimeLimit() != null ? quiz.getTimeLimit() : 0)) // Approximation since we didn't start explicitly
                .completedAt(LocalDateTime.now())
                .score(percentage)
                .passed(passed)
                .status("COMPLETED")
                .build();
        
        attempt = quizAttemptRepository.save(attempt);

        return new QuizAttemptResponse(
                attempt.getId(),
                quizId,
                userId,
                attempt.getScore(),
                attempt.getPassed(),
                attempt.getStartedAt(),
                attempt.getCompletedAt()
        );
    }
}
