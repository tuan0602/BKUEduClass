package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.EnrollmentDTO;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.Enrollment;
import com.bk.eduClass.model.Student;

public class EnrollmentMapper {

    public static EnrollmentDTO toDTO(Enrollment enrollment) {
        if (enrollment == null) return null;

        return EnrollmentDTO.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .courseId(enrollment.getCourse() != null ? enrollment.getCourse().getCourseId() : null)
                .studentId(enrollment.getStudent() != null ? enrollment.getStudent().getStudentId() : null)
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }

    public static Enrollment toEntity(EnrollmentDTO dto) {
        if (dto == null) return null;

        Enrollment enrollment = new Enrollment();
        enrollment.setEnrollmentId(dto.getEnrollmentId());
        enrollment.setEnrolledAt(dto.getEnrolledAt());

        if (dto.getCourseId() != null) {
            Course course = new Course();
            course.setCourseId(dto.getCourseId());
            enrollment.setCourse(course);
        }

        if (dto.getStudentId() != null) {
            Student student = new Student();
            student.setStudentId(dto.getStudentId());
            enrollment.setStudent(student);
        }

        return enrollment;
    }
}
