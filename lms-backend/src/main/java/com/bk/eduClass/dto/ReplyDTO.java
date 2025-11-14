package com.bk.eduClass.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReplyDTO {
    private String replyId;
    private String discussionId;
    private String authorId;
    private String content;
    private LocalDateTime createdAt;
}
