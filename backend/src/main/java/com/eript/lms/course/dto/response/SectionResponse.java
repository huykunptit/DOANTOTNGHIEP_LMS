package com.eript.lms.course.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class SectionResponse {
    private Long id;
    private Long courseId;
    private String title;
    private Integer position;
    private List<LessonResponse> lessons;
}
