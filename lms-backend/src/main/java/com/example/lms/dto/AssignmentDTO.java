package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private String id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private int maxScore;
    private String courseId;
    private String status;
    private List<SubmissionDTO> submissions;
}
