package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.SubmissionDTO;
import com.bk.eduClass.model.Assignment;
import com.bk.eduClass.model.Student;
import com.bk.eduClass.model.Submission;
import com.bk.eduClass.repository.AssignmentRepository;
import com.bk.eduClass.repository.StudentRepository;
import com.bk.eduClass.repository.SubmissionRepository;
import com.bk.eduClass.service.SubmissionService;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

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
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<SubmissionDTO> getAll() {
        return submissionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubmissionDTO create(SubmissionDTO submissionDTO) {
        Submission submission = toEntity(submissionDTO);
        Objects.requireNonNull(submission, "Submission entity is null");
        submission = submissionRepository.save(submission);
        return toDTO(submission);
    }

    @Override
    public SubmissionDTO update(String submissionId, SubmissionDTO submissionDTO) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        
        submission.setSubmittedAt(submissionDTO.getSubmittedAt());
        submission.setFileUrl(submissionDTO.getFileUrl());
        submission.setScore(submissionDTO.getScore());
        submission.setFeedback(submissionDTO.getFeedback());
        submission.setFileName(submissionDTO.getFileName());
        submission.setNotes(submissionDTO.getNotes());
        submission.setStatus(submissionDTO.getStatus());

        submissionRepository.save(submission);
        return toDTO(submission);
    }

    @Override
    public void delete(String submissionId) {
        submissionRepository.deleteById(submissionId);
    }

    private SubmissionDTO toDTO(Submission submission) {
        return SubmissionDTO.builder()
                .submissionId(submission.getSubmissionId())
                .assignmentId(submission.getAssignment().getAssignmentId())
                .studentId(submission.getStudent().getStudentId())
                .submittedAt(submission.getSubmittedAt())
                .fileUrl(submission.getFileUrl())
                .score(submission.getScore())
                .feedback(submission.getFeedback())
                .fileName(submission.getFileName())
                .notes(submission.getNotes())
                .status(submission.getStatus())
                .build();
    }

    private Submission toEntity(SubmissionDTO dto) {
        Submission submission = new Submission();
        submission.setSubmissionId(dto.getSubmissionId());
        submission.setSubmittedAt(dto.getSubmittedAt());
        submission.setFileUrl(dto.getFileUrl());
        submission.setScore(dto.getScore());
        submission.setFeedback(dto.getFeedback());
        submission.setFileName(dto.getFileName());
        submission.setNotes(dto.getNotes());
        submission.setStatus(dto.getStatus());

        assignmentRepository.findById(dto.getAssignmentId()).ifPresent(submission::setAssignment);
        studentRepository.findById(dto.getStudentId()).ifPresent(submission::setStudent);

        return submission;
    }
}
