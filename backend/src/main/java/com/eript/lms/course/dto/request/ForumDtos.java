package com.eript.lms.course.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ForumDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QARequest {
        private Long lessonId;
        private String title;
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QAReplyRequest {
        private String content;
    }
}
