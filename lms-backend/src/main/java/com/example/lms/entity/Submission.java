package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Submission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @Column(name = "submissionId", length = 36)
    private String submissionId;

    @ManyToOne
    @JoinColumn(
        name = "assignmentId",
        referencedColumnName = "assignmentId",
        nullable = false,
        foreignKey = @ForeignKey(name = "FK_Submission_Assignment")
    )
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(
        name = "studentId",
        referencedColumnName = "studentId",
        nullable = false,
        foreignKey = @ForeignKey(name = "FK_Submission_Student")
    )
    private Student student;

    @Column(name = "submittedAt")
    private LocalDateTime submittedAt;

    @Column(name = "fileUrl", length = 255)
    private String fileUrl;

    @Column(name = "fileName", length = 255)
    private String fileName;

    @Column(name = "score")
    private Integer score;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        columnDefinition = "ENUM('submitted', 'graded') DEFAULT 'submitted'",
        nullable = false
    )
    private Status status = Status.submitted;

    public enum Status {
        submitted, graded
    }
}
