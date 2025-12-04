package com.example.demo.dto.response.submissionDTO;

import com.example.demo.domain.Submission;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReponseDetailSubmissionDTO {
    private Long submissionId;
    private LocalDateTime submittedAt;
    private Double grade;
    private List<ResultAnswer> answers;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResultAnswer{
        private String QuestionContent;
        private String AnswerA;
        private String AnswerB;
        private String AnswerC;
        private String AnswerD;
        private String AnswerOfUser;
        private Boolean isCorrect;
    }
    public ReponseDetailSubmissionDTO(Submission submission) {
        this.submissionId = submission.getId();
        this.submittedAt = submission.getSubmittedAt();
        this.grade = submission.getGrade();
        this.answers = new ArrayList<ResultAnswer>();
        submission.getAnswerOfSubmissions().forEach(answer -> {
            ResultAnswer resultAnswer = new ResultAnswer();
            resultAnswer.QuestionContent = answer.getQuestion().getQuestion();
            resultAnswer.AnswerA = answer.getQuestion().getAnswerA();
            resultAnswer.AnswerB = answer.getQuestion().getAnswerB();
            resultAnswer.AnswerC = answer.getQuestion().getAnswerC();
            resultAnswer.AnswerD = answer.getQuestion().getAnswerD();
            resultAnswer.AnswerOfUser = answer.getAnswer().name();
            resultAnswer.isCorrect = answer.isCorrect();
            this.answers.add(resultAnswer);
        });
    }
    public static ReponseDetailSubmissionDTO fromSubmission(Submission submission) {return new ReponseDetailSubmissionDTO(submission);}
}
