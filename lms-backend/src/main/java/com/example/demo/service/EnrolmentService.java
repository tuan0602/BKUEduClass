package com.example.demo.service;

import com.example.demo.domain.Course;
import com.example.demo.domain.CourseEnrollment;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.domain.enumeration.Role;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import com.example.demo.repository.CourseEnrollmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResultPaginationDTO getEnrolls(Pageable pageable,String courseName,String courseCode,String studentName,EnrollmentStatus status,String userMail) {
        User user=userRepository.findByEmail(userMail).orElse(null);
        Specification<CourseEnrollment> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
            //Nếu Có filter
            if (courseName != null && !courseName.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("course").get("name")), "%" + courseName.toLowerCase() + "%"));
            }
            if (courseCode != null && !courseCode.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("course").get("code")), "%" + courseName.toLowerCase() + "%"));
            }
            if (studentName != null && !studentName.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("student").get("name")), "%" + studentName.toLowerCase() + "%"));
            }
            if (status != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("status"), status));
            }

            return predicate;
        };
        Page<CourseEnrollment> page= courseEnrollmentRepository.findAll(spec, pageable);
        List<CourseEnrollment> result=page.getContent();

        ResultPaginationDTO resultPaginationDTO=new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt=new ResultPaginationDTO.Meta();

        mt.setCurrentPage(page.getNumber());
        mt.setPageSize(page.getSize());
        mt.setTotalPages(page.getTotalPages());
        mt.setTotalElements(page.getNumberOfElements());

        resultPaginationDTO.setMeta(mt);
        resultPaginationDTO.setResult(result);
        return resultPaginationDTO;
    }


}
