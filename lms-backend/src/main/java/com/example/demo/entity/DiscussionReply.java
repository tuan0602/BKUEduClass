package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.example.demo.entity.Discussion;
import com.example.demo.entity.User;

@Entity
@Table(name = "discussion_replies")
@Getter
@Setter
@NoArgsConstructor
public class DiscussionReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "discussionId", nullable = false)
    private Long discussionId;

    @Column(name = "createdBy", nullable = false)
    private String createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discussionId", insertable = false, updatable = false)
    private Discussion discussion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "createdBy", insertable = false, updatable = false)
    private User creator;

    @NotBlank
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

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