package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Course")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @Column(name = "courseId", length = 36)
    private String courseId;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "coverImage", length = 255)
    private String coverImage;

    @Column(name = "semester", length = 20)
    private String semester;

    @Column(name = "enrollmentCode", length = 20, nullable = false, unique = true)
    private String enrollmentCode;

    @Column(name = "isLocked", nullable = false)
    private boolean isLocked = false;

    @Column(name = "studentCount", columnDefinition = "INT DEFAULT 0")
    private Integer studentCount = 0;

    // Teacher relation (teacherId FK)
    @ManyToOne
    @JoinColumn(
        name = "teacherId",
        referencedColumnName = "teacherId",
        nullable = false,
        foreignKey = @ForeignKey(name = "FK_Course_Teacher")
    )
    @JsonBackReference
    private Teacher teacher;

    // Relationships
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Enrollment> enrollments = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Assignment> assignments = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Discussion> discussions = new ArrayList<>();

    // Convenience getter
    @Transient
    public int getStudentCountComputed() {
        return enrollments == null ? 0 : enrollments.size();
    }
}
