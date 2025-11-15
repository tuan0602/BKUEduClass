package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.TeacherDTO;
import com.bk.eduClass.mapper.TeacherMapper;
import com.bk.eduClass.model.Teacher;
import com.bk.eduClass.model.User;
import com.bk.eduClass.repository.TeacherRepository;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.TeacherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = TeacherMapper.toEntity(teacherDTO);

        // set User
        User user = userRepository.findById(teacherDTO.getUserId()).orElse(null);
        teacher.setUser(user);

        teacher = teacherRepository.save(teacher);
        return TeacherMapper.toDTO(teacher);
    }

    @Override
    public TeacherDTO getTeacherById(String teacherId) {
        return teacherRepository.findById(teacherId)
                .map(TeacherMapper::toDTO)
                .orElse(null);
    }

    @Override
    public TeacherDTO getTeacherByUserId(String userId) {
        return teacherRepository.findByUserUserId(userId)
                .map(TeacherMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(TeacherMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherDTO updateTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = TeacherMapper.toEntity(teacherDTO);

        // update User
        User user = userRepository.findById(teacherDTO.getUserId()).orElse(null);
        teacher.setUser(user);

        teacher = teacherRepository.save(teacher);
        return TeacherMapper.toDTO(teacher);
    }

    @Override
    public void deleteTeacher(String teacherId) {
        teacherRepository.deleteById(teacherId);
    }
}
