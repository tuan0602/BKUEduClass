package com.example.lms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private String id;
    private String name;
    private String code;
    private String description;
    private String coverImage;
    private String semester;
    private String enrollmentCode;
    private boolean isLocked;
    private String teacherId;
    private int studentCount;
    private List<AssignmentDTO> assignments;
}
