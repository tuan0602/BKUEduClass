package com.bk.eduClass.repository;

import com.bk.eduClass.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, String> {
    Optional<Course> findByCode(String code);
    Optional<Course> findByEnrollmentCode(String enrollmentCode);
    List<Course> findByTeacherTeacherId(String teacherId);
}
