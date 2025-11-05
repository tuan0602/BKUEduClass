package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Student")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @Column(name = "studentId", length = 36)
    private String studentId;

    @OneToOne
    @JoinColumn(
        name = "userId",
        referencedColumnName = "userId",
        nullable = false,
        unique = true,
        foreignKey = @ForeignKey(name = "FK_Student_User")
    )
    private User user;

    @Column(name = "major", length = 100)
    private String major;

    @Column(name = "year")
    private Integer year;

    @Column(name = "className", length = 50)
    private String className;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Submission> submissions = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Enrollment> enrollments = new ArrayList<>();

    // Constructor tiện dụng khi khởi tạo nhanh
    public Student(String studentId, User user, String major, Integer year, String className) {
        this.studentId = studentId;
        this.user = user;
        this.major = major;
        this.year = year;
        this.className = className;
    }
}
