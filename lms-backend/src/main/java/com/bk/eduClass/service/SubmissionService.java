package com.bk.eduClass.service;

import com.bk.eduClass.dto.SubmissionDTO;
import java.util.List;

public interface SubmissionService {
    SubmissionDTO getById(String submissionId);
    List<SubmissionDTO> getAll();
    SubmissionDTO create(SubmissionDTO submissionDTO);
    SubmissionDTO update(String submissionId, SubmissionDTO submissionDTO);
    void delete(String submissionId);
}
