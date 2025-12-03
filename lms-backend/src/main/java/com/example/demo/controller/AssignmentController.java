package com.example.demo.controller;

import com.example.demo.domain.Assignment;
import com.example.demo.dto.request.Assignment.AddQuestionDTO;
import com.example.demo.dto.request.Assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.AssignmentService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/teacher/assignments")
public class AssignmentController {
     final private AssignmentService assignmentService;
     final private SecurityUtil securityUtil;
     @PostMapping()
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "CreateAssignment", description = "ceate a new assignment with the provided information")
     public ResponseEntity<ApiResponse<Assignment>> createAssignment(@RequestBody @Valid CreateAssignmentDTO dto) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          Assignment createdAssignment = assignmentService.createAssignment(dto, user);
          ApiResponse<Assignment> response=new ApiResponse<>(HttpStatus.CREATED,"create successful",createdAssignment,null);
          return ResponseEntity.ok().body(response);
     }
     @PostMapping("/{id}/questions")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "add Question to Assignment", description = "create a new user with the provided information")
     public ResponseEntity<ApiResponse<Assignment>> addQuestion(@RequestBody AddQuestionDTO question, @PathVariable Long id) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          Assignment assignment=assignmentService.addQuestionToAssignment(id, question, user);
          ApiResponse<Assignment> response=new ApiResponse<>(HttpStatus.OK,"add question successful",assignment,null);
          return ResponseEntity.ok().body(response);
     }
     @DeleteMapping("/{assignmentId}/questions/{questionId}/remove")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "remove Question of Assignment", description = "remove question of assignment with the provided information")
     public ResponseEntity<ApiResponse<Assignment>> removeQuestion(@PathVariable Long assignmentId,@PathVariable Long questionId) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          Assignment assignment=assignmentService.removeQuestion(assignmentId,questionId, user);
          ApiResponse<Assignment> response=new ApiResponse<>(HttpStatus.OK,"add question successful",assignment,null);
          return ResponseEntity.ok().body(response);
     }
     @DeleteMapping("/{assignmentId}/remove")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "remove Assignment", description = "remove assignment with the provided information")
     public ResponseEntity<ApiResponse<Void>> removeAssignment(@PathVariable Long assignmentId) {
            String user = securityUtil.getCurrentUserLogin()
                    .orElseThrow(()-> new RuntimeException("User not found"));
            assignmentService.deleteAssignment(assignmentId, user);
            ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"remove assignment successful",null,null);
            return ResponseEntity.ok().body(response);
     }
     @PostMapping("/{assignmentId}/publish")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name="BearerAuth")
     @Operation (summary = "publish Assignment", description = "publish assignment with the provided information")
     public ResponseEntity<ApiResponse<Void>> pulishAssignment(@PathVariable Long    assignmentId) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          assignmentService.publishAssignment(assignmentId, user);
          ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"publish assignment successful",null,null);
          return ResponseEntity.ok().body(response);
     }
}
