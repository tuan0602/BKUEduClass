package com.example.demo.dto.request.Assignment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAssignmentDTO {
    private Long courseId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
}
