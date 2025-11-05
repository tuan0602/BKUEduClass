package com.example.lms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private String id;
    private String courseId;
    private String studentId;
    private LocalDateTime enrolledAt;
    private String status;
}
