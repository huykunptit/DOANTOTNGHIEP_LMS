package com.eript.lms.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumQAResponse {
    private Long id;
    private Long userId;
    private String authorName;
    private String title;
    private String content;
    private Boolean isResolved;
    private Long lessonId;
    private String instructorReply;
    private int replyCount;
    private LocalDateTime createdAt;
}
