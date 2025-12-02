package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Entity
@Table(name = "Teacher")
@Getter
@Setter
public class Teacher {

    @Id
    private String teacherId;

    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;

    private String department;
    private LocalDate hireDate;

    // getters & setters
}
