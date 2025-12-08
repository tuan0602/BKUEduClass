package com.example.demo.dto.response.report;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressLearning {
    private double AverageGrade;
    private int numberCourse;
    private int numberAssignments;
    private int numberSubmissions;
    private double submissionRate;
}
