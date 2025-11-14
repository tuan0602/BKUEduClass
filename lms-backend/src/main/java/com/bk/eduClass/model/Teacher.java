package com.bk.eduClass.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
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
