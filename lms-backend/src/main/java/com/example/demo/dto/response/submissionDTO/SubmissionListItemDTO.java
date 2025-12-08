package com.example.demo.dto.response.submissionDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionListItemDTO {
    private String studentName;
    private String studentEmail;
    private LocalDateTime submittedAt;
    private Double grade;
    private int correctAnswers;
    private int totalQuestions;
}
