package com.example.demo.dto.request.submission;

import com.example.demo.domain.enumeration.Answer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitSubmissionDTO {
    private Long assignmentId;
    private List<AnswerTheQuestion> answers;
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerTheQuestion {
        private Long questionId;
        private Answer answer;
    }
}
