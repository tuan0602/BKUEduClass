package com.example.demo.service;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.Course;
import com.example.demo.domain.Question;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.StatusAssignment;
import com.example.demo.dto.request.assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.assignmentDTO.ReponseAssignmentForStudentDTO;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.dto.response.assignmentDTO.ReponseAssignmentDTO;
import com.example.demo.repository.*;
import com.example.demo.util.errors.ResourceNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    final private AssignmentRepository assignmentRepository;
    final private UserRepository userRepository;
    final private CourseRepository courseRepository;
    final private QuestionRepository questionRepository;
    final private CourseEnrollmentRepository courseEnrollmentRepository;
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
        assignment.setStatus(dto.getStatus());
        List<Question> questions= new ArrayList<Question>();
        List<CreateAssignmentDTO.QuestionDTO> questionDTOs = new ArrayList<CreateAssignmentDTO.QuestionDTO>();
        for (CreateAssignmentDTO.QuestionDTO questionDTO : dto.getQuestion()) {
            Question question = new Question();
            question.setQuestion(questionDTO.getQuestion());
            question.setAnswerA(questionDTO.getAnswerA());
            question.setAnswerB(questionDTO.getAnswerB());
            question.setAnswerC(questionDTO.getAnswerC());
            question.setAnswerD(questionDTO.getAnswerD());
            question.setCorrectAnswer(questionDTO.getCorrectAnswer());
            question.setAssignment(assignment);
            questions.add(question);
        }
        assignment.setQuestions(questions);

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
    public ResultPaginationDTO getAllAssignmentsByCourseId(Long courseId,String title , Pageable pageable, String currentUserEmail) {
        if (courseRepository.findById(courseId).isEmpty()) {
            throw new ResourceNotFoundException("Course not found");
        }
        User currentUser= userRepository.findByEmail(currentUserEmail).orElse(null);
        User user= userRepository.findByEmail(currentUserEmail).orElse(null);
        if (currentUser==null){
            throw new ResourceNotFoundException("User not found");
        }
        Course course= courseRepository.findById(courseId).orElse(null);
        if (course==null){
            throw new ResourceNotFoundException("Course not found");
        }
        switch (user.getRole()){
            case STUDENT:
                boolean isEnrolled=courseEnrollmentRepository.existsByStudentAndCourseAndStatus(user,course, com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
                if(!isEnrolled){
                    throw new RuntimeException("User not enrolled in course");
                }
                break;
            case TEACHER:
                if(!course.getTeacher().getEmail().equals(currentUserEmail)){
                    throw new RuntimeException("User not in course");
                }
                break;
            default:
                throw new RuntimeException("Invalid user role");
        }

        Specification<Assignment> spec = (root, query, cb) -> {
            Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
            //Nếu Có filter
            if (title != null && !title.isEmpty()) {
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }
            predicate = cb.and(predicate, cb.equal(root.get("course").get("id"), courseId));
            if (currentUser.getRole().toString().equals("STUDENT")){
                predicate = cb.and(predicate, cb.equal(root.get("status"), StatusAssignment.PUBLISHED));
            }
            return predicate;
        };

        Page<Assignment> page= assignmentRepository.findAll(spec, pageable);
        List<ReponseAssignmentDTO> result=page.getContent().stream().map(ReponseAssignmentDTO::fromAssignment).collect(Collectors.toList());

        ResultPaginationDTO resultPaginationDTO=new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt=new ResultPaginationDTO.Meta();

        mt.setCurrentPage(page.getNumber());
        mt.setPageSize(page.getSize());
        mt.setTotalPages(page.getTotalPages());
        mt.setTotalElements(page.getNumberOfElements());

        resultPaginationDTO.setMeta(mt);
        resultPaginationDTO.setResult(result);
        return resultPaginationDTO;
    }
    public Assignment getAssignmentDetail(Long assignmentId, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        User user= userRepository.findByEmail(currentUserEmail).orElse(null);
        if (user==null){
            throw new ResourceNotFoundException("User not found");
        }
        if (user.getRole().toString().equals("STUDENT")){
            if (assignment.getStatus() != StatusAssignment.PUBLISHED){
                throw new ResourceNotFoundException("Assignment not Published");
            }
            boolean isEnrolled=courseEnrollmentRepository.existsByStudentAndCourseAndStatus(user,assignment.getCourse(), com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
            if(!isEnrolled){
                throw new RuntimeException("User not enrolled in course");
            }
        }

        return assignment;
    }
    public Assignment updateAssignment(Long assignmentId,CreateAssignmentDTO dto, String currentUserEmail) {
        Course course = courseRepository.findById(assignmentId).orElse(null);
        if (course == null) {
            throw new ResourceNotFoundException("Course not found");
        }
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        validateTeacher(assignment.getCourse(), currentUserEmail);
        if (assignment.getStatus() != StatusAssignment.DRAFT) {
            throw new IllegalStateException("Cannot update a published assignment");
        }
        //Cập nhật các trường cần thiết
        assignment.getQuestions().clear();  // Hibernate tự orphan-delete

        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setStatus(dto.getStatus());
        List<CreateAssignmentDTO.QuestionDTO> questionDTOs = new ArrayList<CreateAssignmentDTO.QuestionDTO>();
        for (CreateAssignmentDTO.QuestionDTO questionDTO : dto.getQuestion()) {
            Question question = new Question();
            question.setQuestion(questionDTO.getQuestion());
            question.setAnswerA(questionDTO.getAnswerA());
            question.setAnswerB(questionDTO.getAnswerB());
            question.setAnswerC(questionDTO.getAnswerC());
            question.setAnswerD(questionDTO.getAnswerD());
            question.setCorrectAnswer(questionDTO.getCorrectAnswer());
            question.setAssignment(assignment);
            assignment.getQuestions().add(question);
        }
        return assignmentRepository.save(assignment);
    }
    public ReponseAssignmentForStudentDTO getAssignmentDetailForStudent(Long assignmentId, String currentUserEmail) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElse(null);
        if (assignment == null) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        //Validate student is enrolled in the course
        return ReponseAssignmentForStudentDTO.fromAssignment(assignment);
    }

}
