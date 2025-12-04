package com.example.demo.dto.request.Course;

import com.example.demo.domain.Course;
import com.example.demo.domain.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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
