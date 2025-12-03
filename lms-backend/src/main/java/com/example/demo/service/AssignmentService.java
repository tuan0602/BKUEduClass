package com.example.demo.service;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.Course;
import com.example.demo.domain.Question;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.StatusAssignment;
import com.example.demo.dto.request.Assignment.AddQuestionDTO;
import com.example.demo.dto.request.Assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.repository.AssignmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.util.errors.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    final private AssignmentRepository assignmentRepository;
    final private CourseRepository courseRepository;
    final private QuestionRepository questionRepository;
    private void validateTeacher(Course course, String currentUserEmail) {
        User teacher= course.getTeacher();
        if (course.getTeacher() == null) {
            throw new ResourceNotFoundException("Course has no assigned teacher");
        }
        if (!teacher.getEmail().equals(currentUserEmail)) {
            throw new SecurityException("You are not the teacher of this course");
        }
    }
    public Assignment createAssignment(CreateAssignmentDTO dto, String currentUserEmail) {
        Course course = courseRepository.findById(dto.getCourseId()).orElse(null);
        if (course == null) {
            throw new ResourceNotFoundException("Course not found");
        }
        validateTeacher(course, currentUserEmail);
        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setCourse(course);
        assignment.setStatus(StatusAssignment.DRAFT);
        return assignmentRepository.save(assignment);
    }
    public void deleteAssignment(Long assignmentId,  String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        if (assignment.getStatus() != StatusAssignment.DRAFT) {
            throw new IllegalStateException("Cannot delete a published assignment");
        }
        List<Question> questions = assignment.getQuestions();
        questionRepository.deleteAll(questions);
        assignmentRepository.deleteById(assignmentId);
    }
    public Assignment addQuestionToAssignment(Long assignmentId, AddQuestionDTO questionDTO, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        if (assignment.getStatus() != StatusAssignment.DRAFT) {
            throw new IllegalStateException("Cannot add questions to a published assignment");
        }
        Question question = new Question();
        question.setQuestion(questionDTO.getQuestion());
        question.setAnswerA(questionDTO.getAnswerA());
        question.setAnswerB(questionDTO.getAnswerB());
        question.setAnswerC(questionDTO.getAnswerC());
        question.setAnswerD(questionDTO.getAnswerD());
        question.setCorrectAnswer(questionDTO.getCorrectAnswer());
        question.setAssignment(assignment);
        // Thêm vào danh sách question của assignment
        assignment.getQuestions().add(question);

        // Save cả assignment và question (cascade ALL sẽ tự save question)
        return assignmentRepository.save(assignment);
    }
    public Assignment removeQuestion(Long assignmentId, Long questionId, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        if (assignment.getStatus() != StatusAssignment.DRAFT) {
            throw new IllegalStateException("Cannot remove questions of published assignment");
        }
        questionRepository.deleteById(questionId);
        return assignmentRepository.findById(assignmentId).orElse(null);
    }
    public void publishAssignment(Long assignmentId, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        if (assignment.getStatus() != StatusAssignment.DRAFT) {
            throw new IllegalStateException("Assignment is already published");
        }
        assignment.setStatus(StatusAssignment.PUBLISHED);
        assignmentRepository.save(assignment);
    }


}
