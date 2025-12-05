package com.example.demo.repository;

import com.example.demo.domain.Course;
import com.example.demo.domain.CourseEnrollment;
import com.example.demo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long>, JpaSpecificationExecutor<CourseEnrollment> {
    Optional<CourseEnrollment> findByStudentAndCourse(User user, Course course);
}