package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Assignment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @Column(name = "assignmentId", length = 36)
    private String assignmentId;

    @ManyToOne
    @JoinColumn(
        name = "courseId",
        referencedColumnName = "courseId",
        nullable = false,
        foreignKey = @ForeignKey(name = "FK_Assignment_Course")
    )
    @JsonBackReference
    private Course course;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "dueDate")
    private LocalDateTime dueDate;

    @Column(name = "maxScore", columnDefinition = "INT DEFAULT 100")
    private Integer maxScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        columnDefinition = "ENUM('pending', 'submitted', 'graded', 'overdue') DEFAULT 'pending'"
    )
    private Status status = Status.pending;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Submission> submissions = new ArrayList<>();

    public enum Status {
        pending, submitted, graded, overdue
    }
}
