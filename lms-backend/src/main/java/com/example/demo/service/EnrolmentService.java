package com.example.demo.service;

import com.example.demo.domain.Course;
import com.example.demo.domain.CourseEnrollment;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.repository.CourseEnrollmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrolmentService {
    final private CourseEnrollmentRepository courseEnrollmentRepository;
    final private CourseRepository courseRepository;
    final private UserService userService;
    private final UserRepository userRepository;

    public void enrollStudentInCourse(String user, String enrollmentCode) {
        Course course=courseRepository.findByCode(enrollmentCode).orElseThrow(()-> new RuntimeException("Course not found"));
        User student=userRepository.findByEmail(user).orElseThrow(()-> new RuntimeException("Student not found"));
        CourseEnrollment courseEnrollment=courseEnrollmentRepository.findByStudentAndCourse(student,course).orElse(null);
        if(courseEnrollment!=null){
            throw new RuntimeException("Student already enrolled in this course");
        }
        CourseEnrollment enrollment=new CourseEnrollment();
        enrollment.setCourse(course);
        enrollment.setStudent(student);
        enrollment.setStatus(com.example.demo.domain.enumeration.EnrollmentStatus.PENDING);
        courseEnrollmentRepository.save(enrollment);
    }
    public void enrollAnswer(String answer, Long enrollmentId) {
        CourseEnrollment enrollment=courseEnrollmentRepository.findById(enrollmentId).orElseThrow(()-> new RuntimeException("Enrollment not found"));
        if(enrollment.getStatus()!= com.example.demo.domain.enumeration.EnrollmentStatus.PENDING){
            throw new RuntimeException("Enrollment is not in pending status");
        }
        // Here we can add logic to check the answer if needed
        if (answer.equalsIgnoreCase("refuse")){
            enrollment.setStatus(EnrollmentStatus.REJECTED);
            courseEnrollmentRepository.save(enrollment);
            return;
        }
        enrollment.setStatus(com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
        courseEnrollmentRepository.save(enrollment);
    }
}
