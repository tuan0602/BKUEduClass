package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.entity.Assignment;
import com.example.lms.entity.Submission;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.AssignmentService;
import com.example.lms.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    private final AssignmentService assignmentService;
    private final SubmissionService submissionService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService, SubmissionService submissionService) {
        this.assignmentService = assignmentService;
        this.submissionService = submissionService;
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDTO>> list() {
        List<AssignmentDTO> dtos = assignmentService.findAll().stream().map(MapperUtil::toAssignmentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentDTO> get(@PathVariable String id) {
        return assignmentService.findById(id).map(MapperUtil::toAssignmentDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AssignmentDTO> create(@RequestBody AssignmentDTO dto) {
        Assignment a = new Assignment();
        a.setId(dto.getId());
        a.setTitle(dto.getTitle());
        a.setDescription(dto.getDescription());
        a.setDueDate(dto.getDueDate());
        a.setMaxScore(dto.getMaxScore());
        a.setStatus(dto.getStatus() == null ? Assignment.Status.PENDING : Assignment.Status.valueOf(dto.getStatus()));
        Assignment saved = assignmentService.save(a);
        return ResponseEntity.ok(MapperUtil.toAssignmentDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentDTO> update(@PathVariable String id, @RequestBody AssignmentDTO dto) {
        return assignmentService.findById(id).map(existing -> {
            existing.setTitle(dto.getTitle());
            existing.setDescription(dto.getDescription());
            existing.setDueDate(dto.getDueDate());
            existing.setMaxScore(dto.getMaxScore());
            existing.setStatus(dto.getStatus() == null ? existing.getStatus() : Assignment.Status.valueOf(dto.getStatus()));
            Assignment saved = assignmentService.save(existing);
            return ResponseEntity.ok(MapperUtil.toAssignmentDTO(saved));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        assignmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Extra endpoint: /assignments/{id}/submissions
    @GetMapping("/{id}/submissions")
    public ResponseEntity<List<SubmissionDTO>> getSubmissions(@PathVariable String id) {
        List<Submission> submissions = submissionService.findByAssignmentId(id);
        List<SubmissionDTO> dtos = submissions.stream().map(MapperUtil::toSubmissionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
