package com.bk.eduClass.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscussionDTO {
    private String discussionId;
    private String courseId;
    private String authorId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private boolean pinned;
    private List<String> replyIds;
}
