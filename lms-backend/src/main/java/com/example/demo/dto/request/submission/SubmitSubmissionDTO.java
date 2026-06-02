package com.example.demo.dto.request.submission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.example.demo.entity.enumeration.Answer;

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
