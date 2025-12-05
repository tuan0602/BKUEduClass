package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.domain.enumeration.Role;
import com.example.demo.dto.request.course.CourseDTO;
import com.example.demo.dto.response.courseDTO.ReponseCourseDTO;
import com.example.demo.dto.response.courseDTO.ReponseDetailCourseDTO;
import com.example.demo.dto.response.ResultPaginationDTO;
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

import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;

    public Course createCourse(CourseDTO courseDTO) {
        Course course = new Course();
        course.setCode(courseDTO.getCode());
        course.setName(courseDTO.getName());
        course.setDescription(courseDTO.getDescription());
        course.setStatus(courseDTO.getStatus());
        User user=userRepository.findById(courseDTO.getTeacherId()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Teacher not found");
        }
        if (user.getRole()!= Role.TEACHER) {
            throw new RuntimeException("User is not a teacher");
        }
        course.setTeacher(user);
        return courseRepository.save(course);
    }
    public ResultPaginationDTO getCourses(Pageable pageable,String nameCourse,String teacherName,String courseCode,String userMail) {
        User user=userRepository.findByEmail(userMail).orElse(null);
        Specification<Course> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
            //Nếu Có filter
            if (nameCourse != null && !nameCourse.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("name")), "%" + nameCourse.toLowerCase() + "%"));
            }
            if (teacherName != null && !teacherName.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("teacher").get("name")), "%" + teacherName.toLowerCase() + "%"));
            }
            if (courseCode != null && !courseCode.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("code")), "%" + courseCode.toLowerCase() + "%"));
            }
            /// ////Student thì lấy course đã đăng k thôi////
            if (user.getRole() == Role.STUDENT) {
                Join<Course, CourseEnrollment> joinEnroll =
                        root.join("enrollments", JoinType.INNER);

                predicate = cb.and(predicate,
                        cb.equal(joinEnroll.get("student").get("id"),
                                user.getUserId()));

                predicate = cb.and(predicate,
                        cb.equal(joinEnroll.get("status"),
                                EnrollmentStatus.ACCEPTED));
            }
            /// ////Teacher thì lấy course của mình thôi////
            if (user.getRole()== Role.TEACHER) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("teacher").get("name")), "%" + user.getName() + "%"));
            }
            return predicate;
        };

        Page<Course> page= courseRepository.findAll(spec, pageable);
        List<ReponseCourseDTO> result=page.getContent().stream().map(ReponseCourseDTO::fromCourse).collect(Collectors.toList());

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
    public ReponseDetailCourseDTO getCoursesDetail(Long courseId, String userMail) {
        User user=userRepository.findByEmail(userMail).orElse(null);
        Course course=courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }
        //Xử lý logic khác
        /// ///Student thì kiểm tra đã đăng ký khóa học chưa////
        if (user.getRole() == Role.STUDENT) {
            boolean isEnrolled  = course.getEnrollments().stream()
                    .filter(enrollment -> enrollment.getStatus() == EnrollmentStatus.ACCEPTED)
                    .map(CourseEnrollment::getStudent)
                    .anyMatch(student -> student.getUserId().equals(user.getUserId()));

            if (!isEnrolled) {
                throw new RuntimeException("You are not enrolled in this course");
            }
        }
        /// ///Teacher thì kiểm tra có phải giáo viên của khóa học không////
        if (user.getRole()== Role.TEACHER) {
            if (!course.getTeacher().getName().equals(user.getName())) {
                throw new RuntimeException("You are not teacher of this course");
            }
        }
        int totalAssignments=0;
        int submittedAssignments=0;
        int documentsCount=0;
        int studentsCount=0;
        double averageGrade=0;
        int discussionsCount=0;
        int submissionRate=0;
        if (user.getRole()== Role.STUDENT) {
            totalAssignments=course.getAssignments() != null ? course.getAssignments().size() : 0;
            List< Submission> submissions =course.getAssignments().stream()
                    .flatMap(a->a.getSubmissions().stream())
                    .filter(s-> s.getStudent().getUserId().equals(user.getUserId()))
                    .toList();
            submittedAssignments=submissions.size();
            discussionsCount=course.getDiscussions() != null ? course.getDiscussions().size() : 0;
            studentsCount= course.getEnrollments() != null ? (int) course.getEnrollments().stream().filter(o-> o.getStatus()== EnrollmentStatus.ACCEPTED).count() : 0;
            averageGrade= submissions.stream()
                    .mapToDouble(Submission::getGrade)
                    .average()
                    .orElse(0.0);
        }
        if (user.getRole()== Role.TEACHER) {
            totalAssignments= course.getAssignments() != null ? course.getAssignments().size() : 0;
            documentsCount= course.getEnrollments() != null ? course.getEnrollments().size() : 0;
            studentsCount= course.getEnrollments() != null ? (int) course.getEnrollments().stream().filter(o-> o.getStatus()== EnrollmentStatus.ACCEPTED).count() : 0;
            List<Assignment> assignments= course.getAssignments();
            if(totalAssignments==0) {
                averageGrade=0;
            } else {
                DoubleSummaryStatistics stats = course.getAssignments().stream()
                        .flatMap(a -> a.getSubmissions().stream())
                        .mapToDouble(Submission -> Submission.getGrade())
                        .summaryStatistics();
                if (totalAssignments==0) {
                    averageGrade=0;
                    submissionRate=100;
                }
                else{
                    averageGrade=stats.getAverage();
                    int totalSubmissions= (int) course.getAssignments().stream()
                            .flatMap(a -> a.getSubmissions().stream())
                            .count();
                    submissionRate= (int) ((double) totalSubmissions / (studentsCount * totalAssignments) * 100);
                }
            }

        }
        if (user.getRole()== Role.ADMIN) {
            totalAssignments= course.getAssignments() != null ? course.getAssignments().size() : 0;
            documentsCount= course.getEnrollments() != null ? course.getEnrollments().size() : 0;
            discussionsCount=course.getDiscussions() != null ? course.getDiscussions().size() : 0;
        }

        return ReponseDetailCourseDTO.fromCourse(course, totalAssignments,submittedAssignments,documentsCount,studentsCount,averageGrade,discussionsCount, submissionRate);
    }
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }
        courseRepository.delete(course);
    }
    public Course updateCourse(Long courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }
        course.setCode(courseDTO.getCode());
        course.setName(courseDTO.getName());
        course.setDescription(courseDTO.getDescription());
        course.setStatus(courseDTO.getStatus());
        User user=userRepository.findById(courseDTO.getTeacherId()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Teacher not found");
        }
        if (user.getRole()!= Role.TEACHER) {
            throw new RuntimeException("User is not a teacher");
        }
        course.setTeacher(user);
        return courseRepository.save(course);
    }
}
