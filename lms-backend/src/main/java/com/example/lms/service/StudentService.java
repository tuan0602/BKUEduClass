package com.example.lms.service;

import com.example.lms.entity.Student;
import com.example.lms.entity.Submission;
import com.example.lms.repository.StudentRepository;
import com.example.lms.repository.SubmissionRepository;
import com.example.lms.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final SubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository,
                          SubmissionRepository submissionRepository,
                          EnrollmentRepository enrollmentRepository) {
        this.studentRepository = studentRepository;
        this.submissionRepository = submissionRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public List<Student> findAll() { return studentRepository.findAll(); }
    public Optional<Student> findById(String id) { return studentRepository.findById(id); }
    public Student save(Student s) { return studentRepository.save(s); }
    public void deleteById(String id) { studentRepository.deleteById(id); }

    public Optional<Student> findByStudentId(String studentId) { return studentRepository.findByStudentId(studentId); }

    // Business: submissions by student
    public List<Submission> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public List<com.example.lms.entity.Enrollment> getEnrollmentsByStudent(String studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }
}
