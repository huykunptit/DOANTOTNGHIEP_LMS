package com.eript.lms.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class GradebookDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradeItemResponse {
        private Long id;
        private String itemType;
        private Long itemId;
        private String name;
        private BigDecimal maxScore;
        private BigDecimal weight;
        private Integer sortOrder;
        private BigDecimal studentScore;
        private String feedback;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradebookResponse {
        private Long courseId;
        private Long userId;
        private BigDecimal totalScore;
        private List<GradeItemResponse> items;
    }
}
