package com.example.demo.dto.response.courseDTO;

import com.example.demo.domain.Course;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReponseDetailCourseDTO {
    private Long id;
    private String name;
    private String description;
    private String code;
    private ResUserDTO teacher;
    private String status;
    public ReponseDetailCourseDTO(Course course){
        this.id=course.getId();
        this.name=course.getName();
        this.description=course.getDescription();
        this.code=course.getCode();
        this.teacher=ResUserDTO.fromUser(course.getTeacher());
        this.status=course.getStatus().name();
    }
    public static ReponseDetailCourseDTO fromCourse(Course course){return  new ReponseDetailCourseDTO(course);}
}
