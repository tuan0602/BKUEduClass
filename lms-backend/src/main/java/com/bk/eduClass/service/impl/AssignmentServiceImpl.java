package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.AssignmentDTO;
import com.bk.eduClass.mapper.AssignmentMapper;
import com.bk.eduClass.model.Assignment;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.repository.AssignmentRepository;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.service.AssignmentService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public AssignmentDTO getById(String assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .map(AssignmentMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<AssignmentDTO> getAll() {
        return assignmentRepository.findAll()
                .stream()
                .map(AssignmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO create(AssignmentDTO assignmentDTO) {
        Assignment assignment = AssignmentMapper.toEntity(assignmentDTO);

        // Set course
        Course course = courseRepository.findById(assignmentDTO.getCourseId()).orElse(null);
        assignment.setCourse(course);

        assignment = assignmentRepository.save(assignment);
        return AssignmentMapper.toDTO(assignment);
    }

    @Override
    public AssignmentDTO update(String assignmentId, AssignmentDTO assignmentDTO) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) return null;

        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDescription(assignmentDTO.getDescription());
        assignment.setDueDate(assignmentDTO.getDueDate());
        assignment.setMaxScore(assignmentDTO.getMaxScore());
        assignment.setStatus(assignmentDTO.getStatus());

        // Update course if needed
        Course course = courseRepository.findById(assignmentDTO.getCourseId()).orElse(null);
        assignment.setCourse(course);

        assignment = assignmentRepository.save(assignment);
        return AssignmentMapper.toDTO(assignment);
    }

    @Override
    public void delete(String assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }
}
