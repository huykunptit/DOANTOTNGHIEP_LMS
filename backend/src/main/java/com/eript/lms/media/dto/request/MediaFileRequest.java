package com.eript.lms.media.dto.request;

public record MediaFileRequest(
        Long ownerId,
        String fileName,
        String filePath,
        String mimeType,
        Long fileSize,
        String scope
) {
}
