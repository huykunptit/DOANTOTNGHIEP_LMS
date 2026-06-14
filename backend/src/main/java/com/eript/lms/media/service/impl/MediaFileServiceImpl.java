package com.eript.lms.media.service.impl;

import com.eript.lms.media.dto.request.MediaFileRequest;
import com.eript.lms.media.dto.response.MediaFileResponse;
import com.eript.lms.media.entity.MediaFile;
import com.eript.lms.exception.ResourceNotFoundException;
import com.eript.lms.media.mapper.MediaFileMapper;
import com.eript.lms.media.repository.MediaFileRepository;
import com.eript.lms.media.service.MediaFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MediaFileServiceImpl implements MediaFileService {

    private final MediaFileRepository mediaFileRepository;
    private final MediaFileMapper mediaFileMapper;

    @Override
    public MediaFileResponse create(MediaFileRequest request) {
        MediaFile mediaFile = mediaFileMapper.toEntity(request);
        mediaFile.setCreatedAt(LocalDateTime.now());
        return mediaFileMapper.toResponse(mediaFileRepository.save(mediaFile));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaFileResponse> getByOwnerId(Long ownerId) {
        return mediaFileRepository.findAllByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(mediaFileMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MediaFileResponse> getByScope(String scope) {
        return mediaFileRepository.findAllByScopeOrderByCreatedAtDesc(scope)
                .stream()
                .map(mediaFileMapper::toResponse)
                .toList();
    }

    @Override
    public MediaFileResponse update(Long id, MediaFileRequest request) {
        MediaFile mediaFile = mediaFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media file not found: " + id));
        mediaFileMapper.updateEntity(request, mediaFile);
        return mediaFileMapper.toResponse(mediaFileRepository.save(mediaFile));
    }

    @Override
    public void delete(Long id) {
        mediaFileRepository.deleteById(id);
    }
}
