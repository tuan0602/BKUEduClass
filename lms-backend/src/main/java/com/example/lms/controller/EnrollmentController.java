package com.example.lms.controller;

import com.example.lms.dto.EnrollmentDTO;
import com.example.lms.entity.Enrollment;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentDTO>> list() {
        List<EnrollmentDTO> dtos = enrollmentService.findAll().stream().map(MapperUtil::toEnrollmentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/enroll")
    public ResponseEntity<EnrollmentDTO> enroll(@RequestParam String courseId, @RequestParam String studentId) {
        String id = UUID.randomUUID().toString();
        Enrollment e = enrollmentService.enrollStudent(id, courseId, studentId);
        return ResponseEntity.ok(MapperUtil.toEnrollmentDTO(e));
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<EnrollmentDTO>> byCourse(@PathVariable String courseId) {
        List<EnrollmentDTO> dtos = enrollmentService.findByCourseId(courseId).stream().map(MapperUtil::toEnrollmentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
