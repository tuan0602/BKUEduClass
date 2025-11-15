package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.CourseDTO;
import com.bk.eduClass.mapper.CourseMapper;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.Teacher;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.TeacherRepository;
import com.bk.eduClass.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public CourseDTO getById(String courseId) {
        return courseRepository.findById(courseId)
                .map(CourseMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<CourseDTO> getAll() {
        return courseRepository.findAll()
                .stream()
                .map(CourseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDTO create(CourseDTO courseDTO) {
        Course course = CourseMapper.toEntity(courseDTO);

        // Set Teacher
        Teacher teacher = teacherRepository.findById(courseDTO.getTeacherId()).orElse(null);
        course.setTeacher(teacher);

        course = courseRepository.save(course);
        return CourseMapper.toDTO(course);
    }

    @Override
    public CourseDTO update(String courseId, CourseDTO courseDTO) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return null;

        course.setName(courseDTO.getName());
        course.setCode(courseDTO.getCode());
        course.setDescription(courseDTO.getDescription());
        course.setSemester(courseDTO.getSemester());
        course.setCoverImage(courseDTO.getCoverImage());
        course.setEnrollmentCode(courseDTO.getEnrollmentCode());
        course.setLocked(courseDTO.isLocked());

        // update Teacher
        Teacher teacher = teacherRepository.findById(courseDTO.getTeacherId()).orElse(null);
        course.setTeacher(teacher);

        course = courseRepository.save(course);
        return CourseMapper.toDTO(course);
    }

    @Override
    public void delete(String courseId) {
        courseRepository.deleteById(courseId);
    }
}
