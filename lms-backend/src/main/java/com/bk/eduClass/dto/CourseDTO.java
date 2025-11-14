package com.bk.eduClass.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private String courseId;
    private String name;
    private String code;
    private String description;
    private String teacherId;
    private String semester;
    private String coverImage;
    private int studentCount;
    private String enrollmentCode;
    private boolean locked;
}
