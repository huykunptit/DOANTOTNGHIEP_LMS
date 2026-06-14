package com.eript.lms.exam.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AnswerRequest(
        @NotBlank String content,
        boolean isCorrect,
        Integer orderIndex,
        String explanation
) {}
