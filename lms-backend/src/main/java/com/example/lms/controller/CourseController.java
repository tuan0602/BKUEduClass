package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.entity.Course;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Discussion;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.CourseService;
import com.example.lms.service.AssignmentService;
import com.example.lms.service.DiscussionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    private final CourseService courseService;
    private final AssignmentService assignmentService;
    private final DiscussionService discussionService;

    @Autowired
    public CourseController(CourseService courseService, AssignmentService assignmentService, DiscussionService discussionService) {
        this.courseService = courseService;
        this.assignmentService = assignmentService;
        this.discussionService = discussionService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> list() {
        List<CourseDTO> dtos = courseService.findAll().stream().map(MapperUtil::toCourseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> get(@PathVariable String id) {
        return courseService.findById(id).map(MapperUtil::toCourseDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CourseDTO> create(@RequestBody CourseDTO dto) {
        Course c = new Course();
        c.setId(dto.getId());
        c.setName(dto.getName());
        c.setCode(dto.getCode());
        c.setDescription(dto.getDescription());
        c.setCoverImage(dto.getCoverImage());
        c.setSemester(dto.getSemester());
        c.setEnrollmentCode(dto.getEnrollmentCode());
        Course saved = courseService.save(c);
        return ResponseEntity.ok(MapperUtil.toCourseDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> update(@PathVariable String id, @RequestBody CourseDTO dto) {
        return courseService.findById(id).map(existing -> {
            existing.setName(dto.getName());
            existing.setCode(dto.getCode());
            existing.setDescription(dto.getDescription());
            existing.setCoverImage(dto.getCoverImage());
            existing.setSemester(dto.getSemester());
            existing.setEnrollmentCode(dto.getEnrollmentCode());
            Course saved = courseService.save(existing);
            return ResponseEntity.ok(MapperUtil.toCourseDTO(saved));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        courseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Extra endpoint: /courses/{id}/assignments
    @GetMapping("/{id}/assignments")
    public ResponseEntity<List<AssignmentDTO>> getAssignments(@PathVariable String id) {
        List<Assignment> assignments = assignmentService.findByCourseId(id);
        List<AssignmentDTO> dtos = assignments.stream().map(MapperUtil::toAssignmentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Extra endpoint: /courses/{id}/discussions
    @GetMapping("/{id}/discussions")
    public ResponseEntity<List<DiscussionDTO>> getDiscussions(@PathVariable String id) {
        List<Discussion> discussions = discussionService.findByCourseId(id);
        List<DiscussionDTO> dtos = discussions.stream().map(MapperUtil::toDiscussionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
