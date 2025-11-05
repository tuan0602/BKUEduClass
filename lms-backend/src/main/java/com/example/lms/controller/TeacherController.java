package com.example.lms.controller;

import com.example.lms.dto.TeacherDTO;
import com.example.lms.entity.Teacher;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {
    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> list() {
        List<TeacherDTO> dtos = teacherService.findAll().stream().map(MapperUtil::toTeacherDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> get(@PathVariable String id) {
        return teacherService.findById(id).map(MapperUtil::toTeacherDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TeacherDTO> create(@RequestBody TeacherDTO dto) {
        Teacher t = new Teacher();
        t.setId(dto.getId());
        t.setEmail(dto.getEmail());
        t.setName(dto.getName());
        t.setTeacherId(dto.getTeacherId());
        Teacher saved = teacherService.save(t);
        return ResponseEntity.ok(MapperUtil.toTeacherDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        teacherService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
