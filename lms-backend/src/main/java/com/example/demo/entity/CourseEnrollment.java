package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.example.demo.entity.enumeration.EnrollmentStatus;

@Entity
@Table(name = "course_enrollments")
@Getter
@Setter
@NoArgsConstructor
public class CourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "courseId")
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "studentId")
    private User student;

    @Column(name = "enrolledAt", nullable = false)
    private LocalDateTime enrolledAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private EnrollmentStatus status;

    @PrePersist
    protected void onCreate() {
        if (enrolledAt == null) {
            enrolledAt = LocalDateTime.now();
        }
        if (status == null) {
            status = EnrollmentStatus.PENDING;
        }
    }


}