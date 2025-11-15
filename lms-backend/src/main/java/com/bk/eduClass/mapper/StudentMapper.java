package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.StudentDTO;
import com.bk.eduClass.model.Student;

public class StudentMapper {

    public static StudentDTO toDTO(Student student) {
        if (student == null) return null;
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getUserId());
        }
        dto.setMajor(student.getMajor());
        dto.setYear(student.getYear());
        dto.setClassName(student.getClassName());
        return dto;
    }

    public static Student toEntity(StudentDTO dto) {
        if (dto == null) return null;
        Student student = new Student();
        student.setStudentId(dto.getStudentId());
        student.setMajor(dto.getMajor());
        student.setYear(dto.getYear());
        student.setClassName(dto.getClassName());
        return student;
    }
}
