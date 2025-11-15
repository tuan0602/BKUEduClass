package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.TeacherDTO;
import com.bk.eduClass.model.Teacher;

public class TeacherMapper {

    public static TeacherDTO toDTO(Teacher teacher) {
        if (teacher == null) return null;
        TeacherDTO dto = new TeacherDTO();
        dto.setTeacherId(teacher.getTeacherId());
        if (teacher.getUser() != null) {
            dto.setUserId(teacher.getUser().getUserId());
        }
        dto.setDepartment(teacher.getDepartment());
        dto.setHireDate(teacher.getHireDate());
        return dto;
    }

    public static Teacher toEntity(TeacherDTO dto) {
        if (dto == null) return null;
        Teacher teacher = new Teacher();
        teacher.setTeacherId(dto.getTeacherId());
        teacher.setDepartment(dto.getDepartment());
        teacher.setHireDate(dto.getHireDate());
        return teacher;
    }
}
