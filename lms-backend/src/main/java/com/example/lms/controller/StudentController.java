package com.example.lms.controller;

import com.example.lms.dto.StudentDTO;
import com.example.lms.entity.Student;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> list() {
        List<StudentDTO> dtos = studentService.findAll().stream().map(MapperUtil::toStudentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> get(@PathVariable String id) {
        return studentService.findById(id).map(MapperUtil::toStudentDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentDTO> create(@RequestBody StudentDTO dto) {
        Student s = new Student();
        s.setId(dto.getId());
        s.setEmail(dto.getEmail());
        s.setName(dto.getName());
        s.setStudentId(dto.getStudentId());
        Student saved = studentService.save(s);
        return ResponseEntity.ok(MapperUtil.toStudentDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        studentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
