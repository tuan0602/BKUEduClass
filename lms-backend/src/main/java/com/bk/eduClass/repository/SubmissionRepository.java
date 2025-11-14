package com.bk.eduClass.repository;

import com.bk.eduClass.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByAssignmentAssignmentId(String assignmentId);
    List<Submission> findByStudentStudentId(String studentId);
}
