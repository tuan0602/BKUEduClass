package com.example.demo.service;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.Course;
import com.example.demo.domain.Question;
import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.StatusAssignment;
import com.example.demo.dto.request.Assignment.AddQuestionDTO;
import com.example.demo.dto.request.Assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.dto.response.listAssignmentDTO.ReponseAssignmentDTO;
import com.example.demo.repository.AssignmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.errors.ResourceNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    final private AssignmentRepository assignmentRepository;
    final private UserRepository userRepository;
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
    //          ResultPaginationDTO resultPaginationDTO = assignmentService.getAllAssignmentsByCourseId(courseId, tile, pageable, user);
    public ResultPaginationDTO getAllAssignmentsByCourseId(Long courseId,String tilte , Pageable pageable, String currentUserEmail) {
         if (courseRepository.findById(courseId).isEmpty()) {
             throw new ResourceNotFoundException("Course not found");
         }
         User currentUser= userRepository.findByEmail(currentUserEmail).orElse(null);
         if (currentUser==null){
             throw new ResourceNotFoundException("User not found");
         }
         switch (currentUser.getRole()){
             case TEACHER:
                 //kiểm tra giáo viên có dạy khoá học này ko
                 Course course= courseRepository.findById(courseId).orElse(null);
                 if (course==null || !course.getTeacher().getEmail().equals(currentUserEmail)){
                     throw new SecurityException("You are not the teacher of this course");
                 }
                 break;
             case STUDENT:
                 //kiểm tra học sinh có đăng ký khoá học này ko
//                 boolean isEnrolled= courseRepository.isStudentEnrolledInCourse(currentUserEmail, courseId);
//                 if (!isEnrolled){
//                     throw new SecurityException("You are not enrolled in this course");
//                 }
                 break;
             case ADMIN:
                 throw new SecurityException("You are not the teacher or student of this course");

             default:
                 throw new SecurityException("Invalid user role");
         }

         Specification<Assignment> spec = (root, query, cb) -> {
             Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
             //Nếu Có filter
             if (tilte != null && !tilte.isEmpty()) {
                 predicate = cb.and(predicate, cb.like(cb.lower(root.get("tilte")), "%" + tilte.toLowerCase() + "%"));
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
         return assignment;
     }
}
