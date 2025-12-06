//package com.example.demo.dto.response.enroll;
//
//import com.example.demo.domain.Course;
//import com.example.demo.domain.User;
//import com.example.demo.domain.enumeration.EnrollmentStatus;
//import com.example.demo.dto.response.courseDTO.ReponseDetailCourseDTO;
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Data
//public class ResEnrollmentDTO {
//    private Course course;
//    private User student;
//    private Long id;
//    private LocalDateTime enrolledAt;
//    private EnrollmentStatus status;
//
//
//    public ReponseDetailCourseDTO(Course course,int totalAssignments,int submittedAssignments,int documentsCount,int studentsCount,double averageGrade, int discussionsCount,double submissionRate) {
//        this.course=course;
//        this.teacher = course.getTeacher() != null ? course.getTeacher() : null;
//        this.students=course.getEnrollments().stream()
//                .filter(enrnrollment-> enrnrollment.getStatus()== EnrollmentStatus.ACCEPTED)
//                .map(enrollment -> enrollment.getStudent())
//                .collect(Collectors.toList());
//        this.data=new ReponseDetailCourseDTO.Dataa();
//        this.data.totalAssignments=totalAssignments;
//        this.data.submittedAssignments=submittedAssignments;
//        this.data.documentsCount=documentsCount;
//        this.data.studentsCount=studentsCount;
//        this.data.averageGrade=averageGrade;
//        this.data.discussionsCount=discussionsCount;
//        this.data.submissionRate= submissionRate;
//
//    }
//    public static ReponseDetailCourseDTO fromCourse(Course course,int totalAssignments,int submittedAssignments,int documentsCount,int studentsCount,double averageGrade,int discussionsCount,double submissionRate){return  new ReponseDetailCourseDTO(course, totalAssignments,submittedAssignments,documentsCount,studentsCount,averageGrade,discussionsCount, submissionRate);}
//}
//}
