package com.example.lms.service;

import com.example.lms.entity.Course;
import com.example.lms.entity.Assignment;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.AssignmentRepository;
import com.example.lms.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository,
                         AssignmentRepository assignmentRepository,
                         EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.assignmentRepository = assignmentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Course> findAll() { return courseRepository.findAll(); }
    public Optional<Course> findById(String id) { return courseRepository.findById(id); }
    public Course save(Course c) { return courseRepository.save(c); }
    public void deleteById(String id) { courseRepository.deleteById(id); }

    // Business: fetch assignments by course
    public List<Assignment> getAssignmentsForCourse(String courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    // Business: count students
    public long countStudents(String courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }
}
