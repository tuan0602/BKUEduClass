package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "Submission")
@Getter
@Setter
public class Submission {

    @Id
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "assignmentId", nullable = false)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    private LocalDateTime submittedAt;
    private String fileUrl;
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('submitted','graded') DEFAULT 'submitted'")
    private Status status = Status.submitted;

    public enum Status {
        submitted, graded
    }

    // getters & setters
}
