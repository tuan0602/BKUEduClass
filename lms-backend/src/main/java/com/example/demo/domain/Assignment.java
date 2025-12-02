package com.example.demo.domain;

import com.example.demo.domain.enumeration.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "Assignment")
public class Assignment {

    @Id
    private String assignmentId;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime dueDate;

    @Column(columnDefinition = "INT DEFAULT 100")
    private Integer maxScore = 100;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('pending','submitted','graded','overdue') DEFAULT 'pending'")
    private Status status = Status.pending;

    

    // getters & setters
}
