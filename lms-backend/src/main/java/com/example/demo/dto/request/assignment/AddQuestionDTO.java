package com.example.demo.dto.request.assignment;
import com.example.demo.domain.enumeration.Answer;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddQuestionDTO {
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
}
