package com.example.lms.service;

import com.example.lms.entity.Enrollment;
import com.example.lms.entity.Course;
import com.example.lms.entity.Student;
import com.example.lms.repository.EnrollmentRepository;
import com.example.lms.repository.CourseRepository;
import com.example.lms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             CourseRepository courseRepository,
                             StudentRepository studentRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    public List<Enrollment> findAll() { return enrollmentRepository.findAll(); }
    public Optional<Enrollment> findById(String id) { return enrollmentRepository.findById(id); }
    public Enrollment save(Enrollment e) { return enrollmentRepository.save(e); }
    public void deleteById(String id) { enrollmentRepository.deleteById(id); }

    public List<Enrollment> findByCourseId(String courseId) { return enrollmentRepository.findByCourseId(courseId); }
    public List<Enrollment> findByStudentId(String studentId) { return enrollmentRepository.findByStudentId(studentId); }
    public long countByCourseId(String courseId) { return enrollmentRepository.countByCourseId(courseId); }

    // helper: enroll a student into a course
    public Enrollment enrollStudent(String id, String courseId, String studentId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        Student student = studentRepository.findById(studentId).orElse(null);
        Enrollment e = new Enrollment();
        e.setId(id);
        e.setCourse(course);
        e.setStudent(student);
        e.setEnrolledAt(LocalDateTime.now());
        e.setStatus("ACTIVE");
        return enrollmentRepository.save(e);
    }
}
