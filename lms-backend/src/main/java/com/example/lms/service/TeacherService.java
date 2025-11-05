package com.example.lms.service;

import com.example.lms.entity.Teacher;
import com.example.lms.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public List<Teacher> findAll() { return teacherRepository.findAll(); }
    public Optional<Teacher> findById(String id) { return teacherRepository.findById(id); }
    public Teacher save(Teacher t) { return teacherRepository.save(t); }
    public void deleteById(String id) { teacherRepository.deleteById(id); }

    public Optional<Teacher> findByTeacherId(String teacherId) { return teacherRepository.findByTeacherId(teacherId); }
}
