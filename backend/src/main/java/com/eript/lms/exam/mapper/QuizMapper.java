package com.eript.lms.exam.mapper;

import com.eript.lms.exam.dto.response.AnswerResponse;
import com.eript.lms.exam.dto.response.QuestionResponse;
import com.eript.lms.exam.dto.response.QuizResponse;
import com.eript.lms.exam.entity.assessment.Quiz;
import com.eript.lms.exam.entity.question.Answer;
import com.eript.lms.exam.entity.question.Question;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class QuizMapper {

    public QuizResponse toResponse(Quiz quiz, List<QuestionResponse> questions) {
        return new QuizResponse(
                quiz.getId(),
                quiz.getCourseId(),
                quiz.getLessonId(),
                quiz.getScope(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getTimeLimit(),
                quiz.getPassScore(),
                questions
        );
    }

    public QuestionResponse toQuestionResponse(Question question, List<AnswerResponse> answers) {
        return new QuestionResponse(
                question.getId(),
                question.getCode(),
                question.getContent(),
                question.getType(),
                question.getDifficulty(),
                question.getDefaultScore(),
                question.getExplanation(),
                answers
        );
    }

    public AnswerResponse toAnswerResponse(Answer answer, boolean excludeCorrectness) {
        return new AnswerResponse(
                answer.getId(),
                answer.getContent(),
                excludeCorrectness ? null : answer.getCorrect(),
                answer.getSortOrder(),
                excludeCorrectness ? null : answer.getSubContent()
        );
    }
}
