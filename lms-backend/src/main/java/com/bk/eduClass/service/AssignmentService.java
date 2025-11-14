package com.bk.eduClass.service;

import com.bk.eduClass.dto.AssignmentDTO;

import java.util.List;

public interface AssignmentService {
    AssignmentDTO getById(String assignmentId);
    List<AssignmentDTO> getAll();
    AssignmentDTO create(AssignmentDTO assignmentDTO);
    AssignmentDTO update(String assignmentId, AssignmentDTO assignmentDTO);
    void delete(String assignmentId);
}
