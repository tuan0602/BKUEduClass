package com.example.lms.service;

import com.example.lms.entity.Submission;
import com.example.lms.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;

    @Autowired
    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    public List<Submission> findAll() { return submissionRepository.findAll(); }
    public Optional<Submission> findById(String id) { return submissionRepository.findById(id); }
    public Submission save(Submission s) { return submissionRepository.save(s); }
    public void deleteById(String id) { submissionRepository.deleteById(id); }

    public List<Submission> findByAssignmentId(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> findByStudentId(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}
