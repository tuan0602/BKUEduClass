package com.example.demo.entity;

import com.example.demo.entity.Assignment;
import com.example.demo.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Submission")
@Getter
@Setter
@NoArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignmentId")
    private Assignment assignment;

    @Column(name = "submittedAt", nullable = false)
    private LocalDateTime submittedAt;
    @Column(name = "grade")
    private Double grade;
    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
    @OneToMany(mappedBy = "submission", orphanRemoval = true)
    List<AnswerOfSubmission>  answerOfSubmissions;
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User student;




}