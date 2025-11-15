package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.CourseDTO;
import com.bk.eduClass.model.Course;

public class CourseMapper {

    public static CourseDTO toDTO(Course course) {
        if (course == null) return null;
        CourseDTO dto = CourseDTO.builder()
                .courseId(course.getCourseId())
                .name(course.getName())
                .code(course.getCode())
                .description(course.getDescription())
                .semester(course.getSemester())
                .coverImage(course.getCoverImage())
                .studentCount(course.getStudentCount() != null ? course.getStudentCount() : 0)
                .enrollmentCode(course.getEnrollmentCode())
                .locked(course.getLocked() != null ? course.getLocked() : false)
                .build();

        if (course.getTeacher() != null) {
            dto.setTeacherId(course.getTeacher().getTeacherId());
        }
        return dto;
    }

    public static Course toEntity(CourseDTO dto) {
        if (dto == null) return null;
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
        return course;
    }
}
