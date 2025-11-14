package com.bk.eduClass.model;

import com.bk.eduClass.model.enums.Type;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
    
@Entity
@Table(name = "Document")
@Getter
@Setter
public class Document {

    @Id
    private String documentId;

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;

    @Column(nullable = false, length = 100)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    private String url;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime uploadedAt;

    private String category;


    // getters & setters
}
