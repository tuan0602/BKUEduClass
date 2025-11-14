package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.TeacherDTO;
import com.bk.eduClass.model.Teacher;
import com.bk.eduClass.repository.TeacherRepository;
import com.bk.eduClass.service.TeacherService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    private TeacherDTO toDTO(Teacher t) {
        TeacherDTO dto = new TeacherDTO();
        dto.setTeacherId(t.getTeacherId());
        dto.setUserId(t.getUser().getUserId());
        dto.setDepartment(t.getDepartment());
        dto.setHireDate(t.getHireDate());
        return dto;
    }

    private Teacher toEntity(TeacherDTO dto) {
        Teacher t = new Teacher();
        t.setTeacherId(dto.getTeacherId());
        t.setDepartment(dto.getDepartment());
        t.setHireDate(dto.getHireDate());
        return t;
    }

    @Override
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher t = teacherRepository.save(toEntity(teacherDTO));
        return toDTO(t);
    }

    @Override
    public TeacherDTO getTeacherById(String teacherId) {
        return teacherRepository.findById(teacherId).map(this::toDTO).orElse(null);
    }

    @Override
    public TeacherDTO getTeacherByUserId(String userId) {
        return teacherRepository.findByUserUserId(userId).map(this::toDTO).orElse(null);
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public TeacherDTO updateTeacher(TeacherDTO teacherDTO) {
        Teacher t = teacherRepository.save(toEntity(teacherDTO));
        return toDTO(t);
    }

    @Override
    public void deleteTeacher(String teacherId) {
        teacherRepository.deleteById(teacherId);
    }
}
