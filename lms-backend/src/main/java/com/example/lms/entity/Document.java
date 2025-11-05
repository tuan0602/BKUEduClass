package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "Document")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @Column(name = "documentId", length = 36)
    private String documentId;

    @ManyToOne
    @JoinColumn(
        name = "courseId",
        referencedColumnName = "courseId",
        nullable = false,
        foreignKey = @ForeignKey(name = "FK_Document_Course")
    )
    @JsonBackReference
    private Course course;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "type",
        nullable = false,
        columnDefinition = "ENUM('pdf', 'video', 'slide')"
    )
    private Type type;

    @Column(name = "url", length = 255, nullable = false)
    private String url;

    @Column(
        name = "uploadedAt",
        columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP"
    )
    private LocalDateTime uploadedAt;

    @Column(name = "category", length = 50)
    private String category;

    public enum Type {
        pdf, video, slide
    }
}
