package com.eript.lms.exam.dto.response;

public record AnswerResponse(
        Long id,
        String content,
        Boolean isCorrect, // Sent as null for students taking exam
        Integer orderIndex,
        String explanation
) {}
