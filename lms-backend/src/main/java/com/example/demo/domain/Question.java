package com.example.demo.domain;

import com.example.demo.domain.enumeration.Answer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "question", columnDefinition = "TEXT")
    private String question;
    @Column(name = "answerA", columnDefinition = "TEXT")
    private String answerA;
    @Column(name = "answerB", columnDefinition = "TEXT")
    private String answerB;
    @Column(name = "answerC", columnDefinition = "TEXT")
    private String answerC;
    @Column(name = "answerD", columnDefinition = "TEXT")
    private String answerD;
    @Enumerated(EnumType.STRING)
    private Answer correctAnswer;



    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "assignmentId")
    private Assignment assignment;


}
