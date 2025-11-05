package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionDTO {
    private String id;
    private String courseId;
    private String authorId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private boolean isPinned;
    private List<ReplyDTO> replies;
}
