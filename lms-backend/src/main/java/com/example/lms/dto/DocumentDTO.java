package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private String id;
    private String courseId;
    private String title;
    private String type;
    private String url;
    private LocalDateTime uploadedAt;
    private String category;
}
