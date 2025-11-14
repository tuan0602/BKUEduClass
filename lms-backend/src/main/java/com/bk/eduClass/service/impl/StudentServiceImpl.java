package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.StudentDTO;
import com.bk.eduClass.model.Student;
import com.bk.eduClass.repository.StudentRepository;
import com.bk.eduClass.service.StudentService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setUserId(student.getUser().getUserId());
        dto.setMajor(student.getMajor());
        dto.setYear(student.getYear());
        dto.setClassName(student.getClassName());
        return dto;
    }

    private Student mapToEntity(StudentDTO dto) {
        Student student = new Student();
        student.setStudentId(dto.getStudentId());
        // user phải set bên ngoài
        student.setMajor(dto.getMajor());
        student.setYear(dto.getYear());
        student.setClassName(dto.getClassName());
        return student;
    }

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = mapToEntity(studentDTO);
        student = studentRepository.save(student);
        return mapToDTO(student);
    }

    @Override
    public StudentDTO getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO updateStudent(StudentDTO studentDTO) {
        Student existing = studentRepository.findById(studentDTO.getStudentId()).orElse(null);
        if(existing == null) return null;
        existing.setMajor(studentDTO.getMajor());
        existing.setYear(studentDTO.getYear());
        existing.setClassName(studentDTO.getClassName());
        existing = studentRepository.save(existing);
        return mapToDTO(existing);
    }

    @Override
    public void deleteStudent(String studentId) {
        studentRepository.deleteById(studentId);
    }
}
