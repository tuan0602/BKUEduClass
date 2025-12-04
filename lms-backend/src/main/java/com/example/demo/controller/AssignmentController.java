package com.example.demo.controller;

import com.example.demo.domain.Assignment;
import com.example.demo.dto.request.assignment.CreateAssignmentDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.assignmentDTO.ReponseAssignmentForStudentDTO;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.service.AssignmentService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api")
public class AssignmentController {
     final private AssignmentService assignmentService;
     final private SecurityUtil securityUtil;
     @PostMapping("/teacher/assignments")
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

     @GetMapping("/assignments/course/{courseId}")
     @PreAuthorize("hasAnyRole('TEACHER','STUDENT')")
     @SecurityRequirement(name="BearerAuth")
     @Operation(summary = "Get List of Assignment of Course", description = "Get List of Assignment by courseId")
     public ResponseEntity<ApiResponse<ResultPaginationDTO>> getAllAssignmentsByCourseId(
             @PathVariable Long courseId,
             @PageableDefault(size = 10,page=0,sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
             @RequestParam(required = false) String title) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          ResultPaginationDTO resultPaginationDTO = assignmentService.getAllAssignmentsByCourseId(courseId, title, pageable, user);
          ApiResponse<ResultPaginationDTO> response=new ApiResponse<>(HttpStatus.OK,"get all assignments successful ",resultPaginationDTO,null);
          return ResponseEntity.ok().body(response);
     }
     @GetMapping("/teacher/assignments/{assignmentId}")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name="BearerAuth")
     @Operation(summary = "Get Detail of Assignment of Course", description = "")
     public ResponseEntity<ApiResponse<Assignment>> getAssignmentDetail(@PathVariable Long assignmentId) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          Assignment reponseAssignmentDTO = assignmentService.getAssignmentDetail(assignmentId, user);
          ApiResponse<Assignment> response=new ApiResponse<>(HttpStatus.OK,"get assignment detail successful ",reponseAssignmentDTO,null);
          return ResponseEntity.ok().body(response);
     }
     @DeleteMapping("/teacher/assignments/{assignmentId}")
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
     @PutMapping("/teacher/assignments/{assignmentId}")
     @PreAuthorize("hasRole('TEACHER')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "updateAssignment", description = "update assignment with the provided information")
     public ResponseEntity<ApiResponse<Assignment>> updateAssigment(
             @RequestBody @Valid CreateAssignmentDTO dto,
             @PathVariable Long assignmentId) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          Assignment createdAssignment = assignmentService.updateAssignment(assignmentId,dto, user);
          ApiResponse<Assignment> response=new ApiResponse<>(HttpStatus.CREATED,"create successful",createdAssignment,null);
          return ResponseEntity.ok().body(response);
     }
     @GetMapping("/student/assignments/{assignmentId}")
     @PreAuthorize("hasRole('STUDENT')")
     @SecurityRequirement(name="BearerAuth")
     @Operation(summary = "Get Detail of Assignment of Course for STUDENT", description = "")
     public ResponseEntity<ApiResponse<ReponseAssignmentForStudentDTO>> getAssignmentDetailforStudent(@PathVariable Long assignmentId) {
          String user = securityUtil.getCurrentUserLogin()
                  .orElseThrow(()-> new RuntimeException("User not found"));
          ReponseAssignmentForStudentDTO reponseAssignmentDTO = assignmentService.getAssignmentDetailForStudent(assignmentId, user);
          ApiResponse<ReponseAssignmentForStudentDTO> response=new ApiResponse<>(HttpStatus.OK,"get assignment detail successful ",reponseAssignmentDTO,null);
          return ResponseEntity.ok().body(response);
     }

}
