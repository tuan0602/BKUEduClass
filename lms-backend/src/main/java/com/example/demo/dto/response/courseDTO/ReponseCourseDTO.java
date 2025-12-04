package com.example.demo.dto.response.courseDTO;


import com.example.demo.domain.Course;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReponseCourseDTO {
    private Long id;
    private String name;
    private String description;
    private String code;
    private String teacherName;
    private String status;
    public ReponseCourseDTO(Course course){
        this.id=course.getId();
        this.name=course.getName();
        this.description=course.getDescription();
        this.code=course.getCode();
        this.teacherName=course.getTeacher().getName();
        this.status=course.getStatus().name();
    }
    public static ReponseCourseDTO fromCourse(Course course){return  new ReponseCourseDTO(course);}

}
