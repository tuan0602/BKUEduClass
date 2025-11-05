package com.example.lms.controller;

import com.example.lms.dto.SubmissionDTO;
import com.example.lms.entity.Submission;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private final SubmissionService submissionService;

    @Autowired
    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public ResponseEntity<List<SubmissionDTO>> list() {
        List<SubmissionDTO> dtos = submissionService.findAll().stream().map(MapperUtil::toSubmissionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDTO> get(@PathVariable String id) {
        return submissionService.findById(id).map(MapperUtil::toSubmissionDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SubmissionDTO> create(@RequestBody SubmissionDTO dto) {
        Submission s = new Submission();
        s.setId(dto.getId());
        s.setSubmittedAt(dto.getSubmittedAt());
        s.setFileUrl(dto.getFileUrl());
        s.setFileName(dto.getFileName());
        s.setNotes(dto.getNotes());
        s.setScore(dto.getScore());
        s.setFeedback(dto.getFeedback());
        s.setStatus(dto.getStatus() == null ? Submission.Status.SUBMITTED : Submission.Status.valueOf(dto.getStatus()));
        Submission saved = submissionService.save(s);
        return ResponseEntity.ok(MapperUtil.toSubmissionDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        submissionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Extra: get submissions by assignment handled in AssignmentController
    // Extra: get submissions by student can be added here
    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<SubmissionDTO>> getByStudent(@PathVariable String studentId) {
        List<SubmissionDTO> dtos = submissionService.findByStudentId(studentId).stream().map(MapperUtil::toSubmissionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
