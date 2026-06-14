package com.eript.lms.exam.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record QuizSubmitRequest(
        @NotNull Map<Long, Long> answers // Map of Question ID to Answer ID
) {}
