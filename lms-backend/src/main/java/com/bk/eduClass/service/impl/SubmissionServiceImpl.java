package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.SubmissionDTO;
import com.bk.eduClass.mapper.SubmissionMapper;
import com.bk.eduClass.model.Submission;
import com.bk.eduClass.repository.AssignmentRepository;
import com.bk.eduClass.repository.StudentRepository;
import com.bk.eduClass.repository.SubmissionRepository;
import com.bk.eduClass.service.SubmissionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository,
                                 AssignmentRepository assignmentRepository,
                                 StudentRepository studentRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public SubmissionDTO getById(String submissionId) {
        return submissionRepository.findById(submissionId)
                .map(SubmissionMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<SubmissionDTO> getAll() {
        return submissionRepository.findAll()
                .stream()
                .map(SubmissionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubmissionDTO create(SubmissionDTO submissionDTO) {
        Submission submission = SubmissionMapper.toEntity(submissionDTO);

        // Set full Assignment and Student from DB if exists
        if (submission.getAssignment() != null && submission.getAssignment().getAssignmentId() != null) {
            assignmentRepository.findById(submission.getAssignment().getAssignmentId())
                    .ifPresent(submission::setAssignment);
        }
        if (submission.getStudent() != null && submission.getStudent().getStudentId() != null) {
            studentRepository.findById(submission.getStudent().getStudentId())
                    .ifPresent(submission::setStudent);
        }

        Objects.requireNonNull(submission, "Submission entity is null");
        submission = submissionRepository.save(submission);
        return SubmissionMapper.toDTO(submission);
    }

    @Override
    public SubmissionDTO update(String submissionId, SubmissionDTO submissionDTO) {
        Submission existing = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        // Update fields
        existing.setSubmittedAt(submissionDTO.getSubmittedAt());
        existing.setFileUrl(submissionDTO.getFileUrl());
        existing.setScore(submissionDTO.getScore());
        existing.setFeedback(submissionDTO.getFeedback());
        existing.setFileName(submissionDTO.getFileName());
        existing.setNotes(submissionDTO.getNotes());
        existing.setStatus(submissionDTO.getStatus());

        // Update Assignment and Student if needed
        if (submissionDTO.getAssignmentId() != null) {
            assignmentRepository.findById(submissionDTO.getAssignmentId())
                    .ifPresent(existing::setAssignment);
        }
        if (submissionDTO.getStudentId() != null) {
            studentRepository.findById(submissionDTO.getStudentId())
                    .ifPresent(existing::setStudent);
        }

        existing = submissionRepository.save(existing);
        return SubmissionMapper.toDTO(existing);
    }

    @Override
    public void delete(String submissionId) {
        submissionRepository.deleteById(submissionId);
    }
}
