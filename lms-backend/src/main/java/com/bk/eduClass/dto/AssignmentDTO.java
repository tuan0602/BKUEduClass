package com.bk.eduClass.dto;

import com.bk.eduClass.model.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {
    private String assignmentId;
    private String courseId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private int maxScore;
    private Status status;
}
