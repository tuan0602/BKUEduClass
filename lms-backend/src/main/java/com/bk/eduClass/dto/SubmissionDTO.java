package com.bk.eduClass.dto;

import com.bk.eduClass.model.Submission.Status;
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
public class SubmissionDTO {
    private String submissionId;
    private String assignmentId;
    private String studentId;
    private LocalDateTime submittedAt;
    private String fileUrl;
    private Integer score;
    private String feedback;
    private String fileName;
    private String notes;
    private Status status;
}
