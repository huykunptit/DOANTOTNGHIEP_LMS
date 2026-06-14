package com.eript.lms.exam.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuizAttemptResponse(
        Long id,
        Long quizId,
        Long userId,
        BigDecimal score,
        Boolean passed,
        LocalDateTime startTime,
        LocalDateTime endTime
) {}
