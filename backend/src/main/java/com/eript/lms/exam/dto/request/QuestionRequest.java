package com.eript.lms.exam.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record QuestionRequest(
        @NotBlank String content,
        @NotBlank String type, // SINGLE_CHOICE
        @NotNull Integer difficulty,
        BigDecimal defaultScore,
        String explanation,
        @NotNull List<AnswerRequest> answers
) {}
