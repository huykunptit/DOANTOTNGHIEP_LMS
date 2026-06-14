package com.eript.lms.media.service;

import com.eript.lms.exception.ResourceNotFoundException;
import com.eript.lms.media.entity.MediaFile;
import com.eript.lms.media.repository.MediaFileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    private final MediaFileRepository mediaFileRepository;

    @Transactional
    public MediaFile storeFile(MultipartFile file, Long uploaderId, String scope) {
        // Ensure directory exists
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown");
        
        try {
            // Check if the file's name contains invalid characters
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFilename);
            }

            // Generate unique filename to avoid overriding
            String fileExtension = "";
            if (originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = this.fileStorageLocation.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct relative URL path
            String fileUrlPath = "/uploads/" + newFilename;

            // Save record in database
            MediaFile mediaFile = MediaFile.builder()
                    .ownerId(uploaderId)
                    .fileName(originalFilename)
                    .filePath(fileUrlPath)
                    .mimeType(file.getContentType())
                    .fileSize(file.getSize())
                    .scope(scope)
                    .createdAt(LocalDateTime.now())
                    .build();

            return mediaFileRepository.save(mediaFile);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }
    
    public MediaFile getFileRecord(Long fileId) {
        return mediaFileRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("MediaFile", fileId));
    }
}
