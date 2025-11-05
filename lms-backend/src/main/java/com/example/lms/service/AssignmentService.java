package com.example.lms.service;

import com.example.lms.entity.Assignment;
import com.example.lms.repository.AssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;

    @Autowired
    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<Assignment> findAll() { return assignmentRepository.findAll(); }
    public Optional<Assignment> findById(String id) { return assignmentRepository.findById(id); }
    public Assignment save(Assignment a) { return assignmentRepository.save(a); }
    public void deleteById(String id) { assignmentRepository.deleteById(id); }

    // Business: fetch assignments by course
    public List<Assignment> findByCourseId(String courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
}
