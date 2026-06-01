package com.eript.lms.media.mapper;

import com.eript.lms.media.dto.request.MediaFileRequest;
import com.eript.lms.media.dto.response.MediaFileResponse;
import com.eript.lms.media.entity.MediaFile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MediaFileMapper {

    MediaFileResponse toResponse(MediaFile mediaFile);

    MediaFile toEntity(MediaFileRequest request);

    void updateEntity(MediaFileRequest request, @MappingTarget MediaFile mediaFile);
}
