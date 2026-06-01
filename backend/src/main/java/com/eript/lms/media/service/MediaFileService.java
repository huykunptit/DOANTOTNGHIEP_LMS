package com.eript.lms.media.service;

import com.eript.lms.media.dto.request.MediaFileRequest;
import com.eript.lms.media.dto.response.MediaFileResponse;

import java.util.List;

public interface MediaFileService {

    MediaFileResponse create(MediaFileRequest request);

    List<MediaFileResponse> getByOwnerId(Long ownerId);

    List<MediaFileResponse> getByScope(String scope);

    MediaFileResponse update(Long id, MediaFileRequest request);

    void delete(Long id);
}
