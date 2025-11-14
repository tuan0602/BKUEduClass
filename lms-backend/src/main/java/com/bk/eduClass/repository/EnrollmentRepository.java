package com.bk.eduClass.repository;

import com.bk.eduClass.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
    List<Enrollment> findByCourseCourseId(String courseId);
    List<Enrollment> findByStudentStudentId(String studentId);
    Optional<Enrollment> findByCourseCourseIdAndStudentStudentId(String courseId, String studentId);
}
