package com.bk.eduClass.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
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
