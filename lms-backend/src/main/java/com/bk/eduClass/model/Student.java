package com.bk.eduClass.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Student")
public class Student {

    @Id
    private String studentId;

    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;

    private String major;
    private Integer year;
    private String className;

    // getters & setters
}
