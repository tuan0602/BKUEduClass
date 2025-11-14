package com.bk.eduClass.model;

import com.bk.eduClass.model.enums.Status;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
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
