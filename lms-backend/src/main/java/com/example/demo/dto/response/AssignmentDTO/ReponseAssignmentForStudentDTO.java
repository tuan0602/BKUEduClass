package com.example.demo.dto.response.AssignmentDTO;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.Submission;
import com.example.demo.domain.enumeration.Answer;
import com.example.demo.domain.enumeration.StatusAssignment;
import com.example.demo.dto.request.Assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.SubmissionDTO.ReponseDetailSubmissionDTO;
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
public class ReponseAssignmentForStudentDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public List<QuestionForStudentDTO> question;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionForStudentDTO{
        private Long questionId;
        private String question;
        private String answerA;
        private String answerB;
        private String answerC;
        private String answerD;
    }
    public ReponseAssignmentForStudentDTO(Assignment assignment) {
        this.id=assignment.getId();
        this.title=assignment.getTitle();
        this.description=assignment.getDescription();
        this.dueDate=assignment.getDueDate();
        this.createdAt=assignment.getCreatedAt();
        this.updatedAt=assignment.getUpdatedAt();
        this.question=new ArrayList<>();
        assignment.getQuestions().forEach(q->{
            QuestionForStudentDTO questionForStudentDTO=new QuestionForStudentDTO();
            questionForStudentDTO.setQuestionId(q.getId());
            questionForStudentDTO.setQuestion(q.getQuestion());
            questionForStudentDTO.setAnswerA(q.getAnswerA());
            questionForStudentDTO.setAnswerB(q.getAnswerB());
            questionForStudentDTO.setAnswerC(q.getAnswerC());
            questionForStudentDTO.setAnswerD(q.getAnswerD());
            this.question.add(questionForStudentDTO);
        });
    }
    public static ReponseAssignmentForStudentDTO fromAssignment(Assignment assignment) {return new ReponseAssignmentForStudentDTO(assignment);}
}
