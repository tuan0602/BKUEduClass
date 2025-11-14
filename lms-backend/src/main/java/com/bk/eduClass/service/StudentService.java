package com.bk.eduClass.service;

import com.bk.eduClass.dto.StudentDTO;
import java.util.List;

public interface StudentService {
    StudentDTO createStudent(StudentDTO studentDTO);
    StudentDTO getStudentById(String studentId);
    List<StudentDTO> getAllStudents();
    StudentDTO updateStudent(StudentDTO studentDTO);
    void deleteStudent(String studentId);
}
