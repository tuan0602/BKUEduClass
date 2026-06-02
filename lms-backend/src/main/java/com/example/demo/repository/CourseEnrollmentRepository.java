package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Course;
import com.example.demo.entity.CourseEnrollment;
import com.example.demo.entity.User;
import com.example.demo.entity.enumeration.EnrollmentStatus;

import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long>, JpaSpecificationExecutor<CourseEnrollment> {
    Optional<CourseEnrollment> findByStudentAndCourse(User user, Course course);
    boolean existsByStudentAndCourseAndStatus(User student, Course course, EnrollmentStatus status);
}