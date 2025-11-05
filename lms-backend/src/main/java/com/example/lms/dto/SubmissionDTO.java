package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {
    private String id;
    private String assignmentId;
    private String studentId;
    private LocalDateTime submittedAt;
    private String fileUrl;
    private String fileName;
    private String notes;
    private Integer score;
    private String feedback;
    private String status;
}
