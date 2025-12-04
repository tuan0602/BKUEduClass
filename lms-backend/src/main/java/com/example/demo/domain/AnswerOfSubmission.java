package com.example.demo.domain;

import com.example.demo.domain.enumeration.Answer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "answer_of_submission")
@Getter
@Setter
@NoArgsConstructor
public class AnswerOfSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "questionId", nullable = false)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    private Answer answer;
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean correct = false;
}