package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.StudentDTO;
import com.bk.eduClass.mapper.StudentMapper;
import com.bk.eduClass.model.Student;
import com.bk.eduClass.model.User;
import com.bk.eduClass.repository.StudentRepository;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentDTO createStudent(StudentDTO studentDTO) {
        Student student = StudentMapper.toEntity(studentDTO);

        // set User
        User user = userRepository.findById(studentDTO.getUserId()).orElse(null);
        student.setUser(user);

        student = studentRepository.save(student);
        return StudentMapper.toDTO(student);
    }

    @Override
    public StudentDTO getStudentById(String studentId) {
        return studentRepository.findById(studentId)
                .map(StudentMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO updateStudent(StudentDTO studentDTO) {
        Student student = StudentMapper.toEntity(studentDTO);

        // set User
        User user = userRepository.findById(studentDTO.getUserId()).orElse(null);
        student.setUser(user);

        student = studentRepository.save(student);
        return StudentMapper.toDTO(student);
    }

    @Override
    public void deleteStudent(String studentId) {
        studentRepository.deleteById(studentId);
    }
}
