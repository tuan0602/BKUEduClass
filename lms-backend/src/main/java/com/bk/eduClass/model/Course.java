package com.bk.eduClass.model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Course")
@Data
public class Course {

    @Id
    private String courseId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "teacherId", nullable = false)
    private Teacher teacher;

    private String semester;
    private String coverImage;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer studentCount = 0;

    @Column(nullable = false, unique = true, length = 20)
    private String enrollmentCode;

    @Column(name = "isLocked", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean locked = false;

    // getters & setters
}
