package com.example.demo.dto.request.Assignment;

import com.example.demo.domain.enumeration.Answer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAssignmentDTO {
    public Long courseId;
    public String title;
    public String description;
    public LocalDateTime dueDate;
    public List<QuestionDTO> question;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDTO{
        private String question;
        private String answerA;
        private String answerB;
        private String answerC;
        private String answerD;
        private Answer correctAnswer;
    }
}
