package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.domain.enumeration.StatusAssignment;
import com.example.demo.dto.request.Submission.SubmitSubmissionDTO;
import com.example.demo.dto.response.SubmissionDTO.ReponseDetailSubmissionDTO;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    final private SubmissionRepository submissionRepository;
    final private AssignmentRepository assignmentRepository;
    final private UserRepository userRepository;
    final private AnswerOfSubmissionRepository answerOfSubmissionRepository;
    final private QuestionRepository questionRepository;
    public void submitSubmission(SubmitSubmissionDTO submitSubmissionDTO,String userEmail) {
        // Implementation goes here
        User user=userRepository.findByEmail(userEmail).orElse(null);
        if (user==null){
            throw new RuntimeException("User not found");
        }
        Assignment assignment=assignmentRepository.findById(submitSubmissionDTO.getAssignmentId()).orElse(null);
        if (assignment==null){
            throw new RuntimeException("Bài tập không tồn tại");
        }
        if (assignment.getDueDate().isBefore(java.time.LocalDateTime.now())){
            throw new RuntimeException("Đã quá hạn nộp bài");
        }
        if (assignment.getStatus()!= StatusAssignment.PUBLISHED){
            throw new RuntimeException("Bài tập chưa được công bố");
        }
        ///////Kiểm tra User thuộc class hay không
        ///////////////////Tạm bỏ qua////////////////////////////
        /// Kiểm tra đã nộp bài chưa
        if (submissionRepository.existsByAssignmentAndStudent(assignment,user)){
            throw new RuntimeException("Bạn đã nộp bài tập này rồi");
        }
        ///  Tạo bài nộp
        Submission submission=new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(user);
        submission.setAnswerOfSubmissions(new ArrayList<AnswerOfSubmission>());
        int numberOfCorrectAnswer=0;
        int numberOfQuestion=assignment.getQuestions().size();
        List<Question> questions=assignment.getQuestions();
        for (SubmitSubmissionDTO.AnswerTheQuestion answerDTO:submitSubmissionDTO.getAnswers()){
            Question question=questions.stream().filter(q->q.getId().equals(answerDTO.getQuestionId())).findFirst().orElse(null);
            if (question==null){
                throw new RuntimeException("Câu hỏi không tồn tại trong bài tập");
            }
            AnswerOfSubmission answerOfSubmission=new AnswerOfSubmission();
            answerOfSubmission.setQuestion(question);
            answerOfSubmission.setSubmission(submission);
            answerOfSubmission.setAnswer(answerDTO.getAnswer());
            //Kiểm tra đáp án
            if (question.getCorrectAnswer().equals(answerDTO.getAnswer())){
                answerOfSubmission.setCorrect(true);
                numberOfCorrectAnswer++;
            }
            else {
                answerOfSubmission.setCorrect(false);
            }
            submission.getAnswerOfSubmissions().add(answerOfSubmission);
        }
        if (numberOfQuestion==0){
            throw new RuntimeException("Bài tập không có câu hỏi");
        }
        Double score=((double)numberOfCorrectAnswer/(double)numberOfQuestion)*10;
        submission.setGrade(score);
        submissionRepository.save(submission);
        answerOfSubmissionRepository.saveAll(submission.getAnswerOfSubmissions());

    }
    public ReponseDetailSubmissionDTO getSubmissionsBySubmissionId(Long SubmissionId,String userEmail) {
        Submission submission=submissionRepository.findById(SubmissionId).orElse(null);
        if (submission==null){
            throw new RuntimeException("Submission not found");
        }
        User user=userRepository.findByEmail(userEmail).orElse(null);
        if (user==null){
            throw new RuntimeException("User not found");
        }
        switch (user.getRole()){
            case STUDENT:
                if (!submission.getStudent().getUserId().equals(user.getUserId())){
                    throw new RuntimeException("Bạn không có quyền xem bài nộp này");
                }
                break;
            case TEACHER:
                if (!submission.getAssignment().getCourse().getTeacher().equals(user.getUserId())){
                    throw new RuntimeException("Bạn không có quyền xem bài nộp này");
                }
                break;
            default:
                break;
        }
        return ReponseDetailSubmissionDTO.fromSubmission(submission);
    }
    public ReponseDetailSubmissionDTO getSubmissionsByAssigmentId(Long assignmentId,String userEmail) {
        Assignment assignment=assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment==null){
            throw new RuntimeException("Assignment not found");
        }
        User user=userRepository.findByEmail(userEmail).orElse(null);
        if (user==null){
            throw new RuntimeException("User not found");
        }
        Submission submission=submissionRepository.findByAssignmentAndStudent(assignment,user).orElse(null);
        if (submission==null){
            throw new RuntimeException("Submission not found");
        }

        switch (user.getRole()){
            case STUDENT:
                if (!submission.getStudent().getUserId().equals(user.getUserId())){
                    throw new RuntimeException("Bạn không có quyền xem bài nộp này");
                }
                break;
            case TEACHER:
                if (!submission.getAssignment().getCourse().getTeacher().equals(user.getUserId())){
                    throw new RuntimeException("Bạn không có quyền xem bài nộp này");
                }
                break;
            default:
                break;
        }
        return ReponseDetailSubmissionDTO.fromSubmission(submission);
    }

    }
