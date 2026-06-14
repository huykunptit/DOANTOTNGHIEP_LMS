package com.eript.lms.exam.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record QuizResponse(
        Long id,
        Long courseId,
        Long lessonId,
        String scope,
        String title,
        String description,
        Integer timeLimit,
        BigDecimal passScore,
        List<QuestionResponse> questions
) {}
