package com.bk.eduClass.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Reply")
public class Reply {

    @Id
    private String replyId;

    @ManyToOne
    @JoinColumn(name = "discussionId", nullable = false)
    private Discussion discussion;

    @ManyToOne
    @JoinColumn(name = "authorId", nullable = false)
    private User author;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // getters & setters
}
