package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReplyDTO {
    private String id;
    private String discussionId;
    private String authorId;
    private String content;
    private LocalDateTime createdAt;
}
