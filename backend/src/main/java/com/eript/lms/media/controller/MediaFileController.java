package com.eript.lms.media.controller;

import com.eript.lms.media.dto.request.MediaFileRequest;
import com.eript.lms.media.dto.response.MediaFileResponse;
import com.eript.lms.media.service.MediaFileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/media-files")
@RequiredArgsConstructor
public class MediaFileController {

    private final MediaFileService mediaFileService;
    private final com.eript.lms.media.service.FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<MediaFileResponse> create(@Valid @RequestBody MediaFileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mediaFileService.create(request));
    }

    @PostMapping("/upload")
    public ResponseEntity<com.eript.lms.media.entity.MediaFile> uploadFile(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "scope", defaultValue = "general") String scope
    ) {
        Long uploaderId = 1L; // Temporarily hardcode uploaderId for testing until SecurityContext is configured for this endpoint
        com.eript.lms.media.entity.MediaFile uploadedFile = fileStorageService.storeFile(file, uploaderId, scope);
        return new ResponseEntity<>(uploadedFile, HttpStatus.CREATED);
    }

    @GetMapping
    public List<MediaFileResponse> getByOwnerId(@RequestParam(required = false) Long ownerId,
                                                @RequestParam(required = false) String scope) {
        if (ownerId != null) {
            return mediaFileService.getByOwnerId(ownerId);
        }
        if (scope != null) {
            return mediaFileService.getByScope(scope);
        }
        return List.of();
    }

    @PutMapping("/{id}")
    public MediaFileResponse update(@PathVariable Long id, @Valid @RequestBody MediaFileRequest request) {
        return mediaFileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediaFileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
