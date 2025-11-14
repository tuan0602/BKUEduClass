package com.bk.eduClass.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TeacherDTO {
    private String teacherId;
    private String userId;
    private String department;
    private LocalDate hireDate;

    // Getters & Setters
}
