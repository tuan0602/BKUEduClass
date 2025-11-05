package com.example.lms.repository;

import com.example.lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByTeacherId(String teacherId);
    boolean existsByCode(String code);
    boolean existsByEnrollmentCode(String enrollmentCode);
}
