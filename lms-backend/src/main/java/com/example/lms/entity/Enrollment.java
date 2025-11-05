package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "Enrollment",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"courseId", "studentId"})}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @Column(name = "enrollmentId", length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    @JsonBackReference
    private Course course;

    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime enrolledAt = LocalDateTime.now();
}
