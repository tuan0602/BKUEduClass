package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.AssignmentDTO;
import com.bk.eduClass.model.Assignment;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.enums.Status;

public class AssignmentMapper {

    public static AssignmentDTO toDTO(Assignment assignment) {
        if (assignment == null) return null;

        AssignmentDTO dto = AssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .maxScore(assignment.getMaxScore() != null ? assignment.getMaxScore() : 100)
                .status(assignment.getStatus() != null ? assignment.getStatus() : Status.pending) // <-- dùng enum Status
                .build();

        if (assignment.getCourse() != null) {
            dto.setCourseId(assignment.getCourse().getCourseId());
        }

        return dto;
    }

    public static Assignment toEntity(AssignmentDTO dto) {
        if (dto == null) return null;

        Assignment assignment = new Assignment();
        assignment.setAssignmentId(dto.getAssignmentId());
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setMaxScore(dto.getMaxScore());
        assignment.setStatus(dto.getStatus() != null ? dto.getStatus() : Status.pending);

        return assignment;
    }
}
