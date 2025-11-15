package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.SubmissionDTO;
import com.bk.eduClass.model.Submission;
import com.bk.eduClass.model.Student;
import com.bk.eduClass.model.Assignment;
import java.util.Objects;

public class SubmissionMapper {

    public static SubmissionDTO toDTO(Submission submission) {
        if (submission == null) return null;

        SubmissionDTO dto = SubmissionDTO.builder()
                .submissionId(submission.getSubmissionId())
                .assignmentId(submission.getAssignment() != null ? submission.getAssignment().getAssignmentId() : null)
                .studentId(submission.getStudent() != null ? submission.getStudent().getStudentId() : null)
                .submittedAt(submission.getSubmittedAt())
                .fileUrl(submission.getFileUrl())
                .score(submission.getScore())
                .feedback(submission.getFeedback())
                .fileName(submission.getFileName())
                .notes(submission.getNotes())
                .status(submission.getStatus() != null ? submission.getStatus() : Submission.Status.submitted)
                .build();
        return dto;
    }

    public static Submission toEntity(SubmissionDTO dto) {
        if (dto == null) return null;

        Submission submission = new Submission();
        submission.setSubmissionId(dto.getSubmissionId());
        submission.setSubmittedAt(dto.getSubmittedAt());
        submission.setFileUrl(dto.getFileUrl());
        submission.setScore(dto.getScore());
        submission.setFeedback(dto.getFeedback());
        submission.setFileName(dto.getFileName());
        submission.setNotes(dto.getNotes());
        submission.setStatus(dto.getStatus() != null ? dto.getStatus() : Submission.Status.submitted);

        if (dto.getAssignmentId() != null) {
            Assignment a = new Assignment();
            a.setAssignmentId(dto.getAssignmentId());
            submission.setAssignment(a);
        }

        if (dto.getStudentId() != null) {
            Student s = new Student();
            s.setStudentId(dto.getStudentId());
            submission.setStudent(s);
        }

        return submission;
    }
}
