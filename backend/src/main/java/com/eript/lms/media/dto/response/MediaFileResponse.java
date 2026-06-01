package com.eript.lms.media.dto.response;

import java.time.LocalDateTime;

public record MediaFileResponse(
        Long id,
        Long ownerId,
        String fileName,
        String filePath,
        String mimeType,
        Long fileSize,
        String scope,
        LocalDateTime createdAt
) {
}
