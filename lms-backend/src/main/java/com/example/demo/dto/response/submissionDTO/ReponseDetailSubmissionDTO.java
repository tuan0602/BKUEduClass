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
    private Boolean submitted;  // 👉 Thêm flag để FE biết đã nộp hay chưa

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

    // Constructor khi có submission
    public ReponseDetailSubmissionDTO(Submission submission) {
        this.submissionId = submission.getId();
        this.submittedAt = submission.getSubmittedAt();
        this.grade = submission.getGrade();
        this.submitted = true;  // ← đã nộp

        this.answers = new ArrayList<>();
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

    public static ReponseDetailSubmissionDTO fromSubmission(Submission submission) {
        return new ReponseDetailSubmissionDTO(submission);
    }

    // 👉 Trả về kết quả trống khi chưa nộp bài
    public static ReponseDetailSubmissionDTO empty() {
        ReponseDetailSubmissionDTO dto = new ReponseDetailSubmissionDTO();
        dto.submissionId = null;
        dto.submittedAt = null;
        dto.grade = null;
        dto.answers = new ArrayList<>();
        dto.submitted = false; // ← quan trọng: FE biết chưa nộp
        return dto;
    }
}
