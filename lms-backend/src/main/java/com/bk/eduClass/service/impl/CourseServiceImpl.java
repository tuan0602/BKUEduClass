package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.CourseDTO;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.TeacherRepository;
import com.bk.eduClass.service.CourseService;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    public CourseServiceImpl(CourseRepository courseRepository, TeacherRepository teacherRepository) {
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public CourseDTO getById(String courseId) {
        return courseRepository.findById(courseId)
            .map(this::toDTO)
            .orElse(null);
    }

    @Override
    public List<CourseDTO> getAll() {
        return courseRepository.findAll()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public CourseDTO create(CourseDTO courseDTO) {
        Course course = toEntity(courseDTO);
        course = courseRepository.save(course);
        return toDTO(course);
    }

    @Override
    public CourseDTO update(String courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        course.setName(courseDTO.getName());
        course.setCode(courseDTO.getCode());
        course.setDescription(courseDTO.getDescription());
        course.setSemester(courseDTO.getSemester());
        course.setCoverImage(courseDTO.getCoverImage());
        course.setLocked(courseDTO.isLocked());
        course.setEnrollmentCode(courseDTO.getEnrollmentCode());
        course = courseRepository.save(course);
        return toDTO(course);
    }

    @Override
    public void delete(String courseId) {
        courseRepository.deleteById(courseId);
    }

    private CourseDTO toDTO(Course course) {
        return CourseDTO.builder()
            .courseId(course.getCourseId())
            .name(course.getName())
            .code(course.getCode())
            .description(course.getDescription())
            .teacherId(course.getTeacher().getTeacherId())
            .semester(course.getSemester())
            .coverImage(course.getCoverImage())
            .studentCount(course.getStudentCount())
            .enrollmentCode(course.getEnrollmentCode())
            .locked(course.getLocked())
            .build();
    }

    private Course toEntity(CourseDTO dto) {
        Course course = new Course();
        course.setCourseId(dto.getCourseId());
        course.setName(dto.getName());
        course.setCode(dto.getCode());
        course.setDescription(dto.getDescription());
        course.setSemester(dto.getSemester());
        course.setCoverImage(dto.getCoverImage());
        course.setStudentCount(dto.getStudentCount());
        course.setEnrollmentCode(dto.getEnrollmentCode());
        course.setLocked(dto.isLocked());

        teacherRepository.findById(dto.getTeacherId()).ifPresent(course::setTeacher);
        return course;
    }
}
