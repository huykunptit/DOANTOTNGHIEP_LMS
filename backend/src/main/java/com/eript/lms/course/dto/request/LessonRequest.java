package com.eript.lms.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LessonRequest {
    @NotNull(message = "Section ID is required")
    private Long sectionId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Lesson type is required")
    private String type; // VIDEO, DOCUMENT, QUIZ
    
    private String videoUrl;
    
    private Integer duration;
    
    private Integer orderIndex;
    
    private Boolean preview = false;
}
