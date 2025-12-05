package com.example.demo.dto.response.courseDTO;

import com.example.demo.domain.Course;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReponseDetailCourseDTO {
    private Course course;
    private User teacher;
    private List<User> students;
    public Dataa data;
    @Data
    public class Dataa{
        int totalAssignments;
        int submittedAssignments;
        int documentsCount;
        int studentsCount;
        double averageGrade;
        int discussionsCount;
        double submissionRate;
    }
    public ReponseDetailCourseDTO(Course course,int totalAssignments,int submittedAssignments,int documentsCount,int studentsCount,double averageGrade, int discussionsCount,double submissionRate) {
        this.course=course;
        this.teacher = course.getTeacher() != null ? course.getTeacher() : null;
        this.students=course.getEnrollments().stream()
                .filter(enrnrollment-> enrnrollment.getStatus()== EnrollmentStatus.ACCEPTED)
                .map(enrollment -> enrollment.getStudent())
                .collect(Collectors.toList());
        this.data=new Dataa();
        this.data.totalAssignments=totalAssignments;
        this.data.submittedAssignments=submittedAssignments;
        this.data.documentsCount=documentsCount;
        this.data.studentsCount=studentsCount;
        this.data.averageGrade=averageGrade;
        this.data.discussionsCount=discussionsCount;
        this.data.submissionRate= submissionRate;

    }
    public static ReponseDetailCourseDTO fromCourse(Course course,int totalAssignments,int submittedAssignments,int documentsCount,int studentsCount,double averageGrade,int discussionsCount,double submissionRate){return  new ReponseDetailCourseDTO(course, totalAssignments,submittedAssignments,documentsCount,studentsCount,averageGrade,discussionsCount, submissionRate);}
}
