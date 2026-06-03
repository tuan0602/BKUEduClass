package com.example.demo.entity;

import com.example.demo.entity.Course;
import com.example.demo.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "courseId")
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploadedBy")
    private User uploader;

    @NotBlank
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "fileUrl", columnDefinition = "TEXT", nullable = false)
    private String fileUrl;

    @Column(name = "fileType", length = 100)
    private String fileType;

    @Column(name = "fileExtension", length = 20)
    private String fileExtension;

    @Column(name = "fileSize")
    private Long fileSize;

    @Column(name = "createdAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}