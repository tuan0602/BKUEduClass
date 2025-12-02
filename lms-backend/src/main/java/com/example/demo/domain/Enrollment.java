package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@Table(name = "Enrollment", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"courseId", "studentId"})
})
public class Enrollment {

    @Id
    private String enrollmentId;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime enrolledAt;

    // getters & setters
}
