package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reply {

    @Id
    @Column(name = "replyId", length = 36)
    private String id;

    @ManyToOne
    @JoinColumn(name = "discussionId", nullable = false)
    @JsonBackReference
    private Discussion discussion;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private User author;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt = LocalDateTime.now();
}
