package com.example.demo.dto.request.course;

import com.example.demo.domain.Course;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {

    private String name;
    private String description;
    private String code;

    private String teacherId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Course.CourseStatus status;


}
