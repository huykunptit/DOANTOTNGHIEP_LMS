package com.eript.lms.course.dto.response;

import lombok.Data;

@Data
public class LessonResponse {
    private Long id;
    private Long sectionId;
    private String title;
    private String description;
    private String type;
    private String videoUrl;
    private Integer duration;
    private Integer orderIndex;
    private Boolean preview;
    private Boolean isCompleted;
}
