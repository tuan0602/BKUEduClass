package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.AssignmentDTO;
import com.bk.eduClass.model.Assignment;
import com.bk.eduClass.repository.AssignmentRepository;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.service.AssignmentService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentServiceImpl(AssignmentRepository assignmentRepository, CourseRepository courseRepository) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public AssignmentDTO getById(String assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<AssignmentDTO> getAll() {
        return assignmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO create(AssignmentDTO assignmentDTO) {
        Assignment assignment = toEntity(assignmentDTO);
        assignment = assignmentRepository.save(assignment);
        return toDTO(assignment);
    }

    @Override
    public AssignmentDTO update(String assignmentId, AssignmentDTO assignmentDTO) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow();
        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDescription(assignmentDTO.getDescription());
        assignment.setDueDate(assignmentDTO.getDueDate());
        assignment.setMaxScore(assignmentDTO.getMaxScore());
        assignment.setStatus(assignmentDTO.getStatus());

        // Update course if needed
        courseRepository.findById(assignmentDTO.getCourseId())
                .ifPresent(assignment::setCourse);

        assignment = assignmentRepository.save(assignment);
        return toDTO(assignment);
    }

    @Override
    public void delete(String assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }

    private AssignmentDTO toDTO(Assignment assignment) {
        return AssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .maxScore(assignment.getMaxScore())
                .status(assignment.getStatus())
                .courseId(assignment.getCourse().getCourseId())
                .build();
    }

    private Assignment toEntity(AssignmentDTO dto) {
        Assignment assignment = new Assignment();
        assignment.setAssignmentId(dto.getAssignmentId());
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setMaxScore(dto.getMaxScore());
        assignment.setStatus(dto.getStatus());

        courseRepository.findById(dto.getCourseId())
                .ifPresent(assignment::setCourse);

        return assignment;
    }
}
