package com.eript.lms.exam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record QuizRequest(
        @NotNull Long courseId,
        Long lessonId,
        @NotBlank String scope,
        @NotBlank String title,
        String description,
        Integer timeLimit,
        BigDecimal passScore
) {}
