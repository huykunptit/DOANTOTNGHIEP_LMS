package com.eript.lms.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SectionRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private Integer position;
}
