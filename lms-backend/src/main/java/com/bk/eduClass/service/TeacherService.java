package com.bk.eduClass.service;

import com.bk.eduClass.dto.TeacherDTO;
import java.util.List;

public interface TeacherService {
    TeacherDTO createTeacher(TeacherDTO teacherDTO);
    TeacherDTO getTeacherById(String teacherId);
    TeacherDTO getTeacherByUserId(String userId);
    List<TeacherDTO> getAllTeachers();
    TeacherDTO updateTeacher(TeacherDTO teacherDTO);
    void deleteTeacher(String teacherId);
}
