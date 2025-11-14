package com.bk.eduClass.service;

import com.bk.eduClass.dto.EnrollmentDTO;
import java.util.List;

public interface EnrollmentService {
    EnrollmentDTO getById(String enrollmentId);
    List<EnrollmentDTO> getAll();
    EnrollmentDTO create(EnrollmentDTO enrollmentDTO);
    EnrollmentDTO update(String enrollmentId, EnrollmentDTO enrollmentDTO);
    void delete(String enrollmentId);
}
