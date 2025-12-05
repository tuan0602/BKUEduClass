package com.example.demo.dto.response.courseDTO;


import com.example.demo.domain.Course;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.dto.response.userDTO.ResUserDTO;
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
    private ResUserDTO teacher;
    private String status;
    private int studentCount;
    private int assignmentCount;
    public ReponseCourseDTO(Course course){
        this.id=course.getId();
        this.name=course.getName();
        this.description=course.getDescription();
        this.code=course.getCode();
        this.status=course.getStatus().name();
        if(course.getTeacher()!=null){
            this.teacher= ResUserDTO.fromUser(course.getTeacher());
        }
        this.studentCount = course.getEnrollments() != null ? course.getEnrollments().stream().filter(o-> o.getStatus()== EnrollmentStatus.ACCEPTED).toList().size() : 0;
        this.assignmentCount = course.getAssignments() != null ? course.getAssignments().size() : 0;
    }
    public static ReponseCourseDTO fromCourse(Course course){return  new ReponseCourseDTO(course);}
}
