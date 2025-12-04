package com.example.demo.service;

import com.example.demo.domain.Course;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.Role;
import com.example.demo.dto.request.Course.CourseDTO;
import com.example.demo.dto.response.CourseDTO.ReponseCourseDTO;
import com.example.demo.dto.response.CourseDTO.ReponseDetailCourseDTO;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

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
            /// ////Teacher thì lấy course của mình thôi////
            if (user.getRole()!= Role.TEACHER) {
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
        /// ///Teacher thì kiểm tra có phải giáo viên của khóa học không////
        if (user.getRole()!= Role.TEACHER) {
            if (!course.getTeacher().getName().equals(user.getName())) {
                throw new RuntimeException("You are not teacher of this course");
            }
        }
        return ReponseDetailCourseDTO.fromCourse(course);
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
