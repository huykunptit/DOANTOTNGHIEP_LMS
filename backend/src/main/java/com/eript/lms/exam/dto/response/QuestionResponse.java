package com.eript.lms.exam.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record QuestionResponse(
        Long id,
        String code,
        String content,
        String type,
        Integer difficulty,
        BigDecimal defaultScore,
        String explanation,
        List<AnswerResponse> answers
) {}
