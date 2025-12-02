package com.example.demo.domain;

import com.example.demo.domain.enumeration.Type;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
    
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
