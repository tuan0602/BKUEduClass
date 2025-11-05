package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Teacher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @Column(name = "teacherId", length = 36)
    private String teacherId;

    @OneToOne
    @JoinColumn(
        name = "userId",
        referencedColumnName = "userId",
        nullable = false,
        unique = true,
        foreignKey = @ForeignKey(name = "FK_Teacher_User")
    )
    private User user;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "hireDate")
    private Date hireDate;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Course> courses = new ArrayList<>();

    // Constructor tiện dụng khi khởi tạo nhanh
    public Teacher(String teacherId, User user, String department, Date hireDate) {
        this.teacherId = teacherId;
        this.user = user;
        this.department = department;
        this.hireDate = hireDate;
    }
}
