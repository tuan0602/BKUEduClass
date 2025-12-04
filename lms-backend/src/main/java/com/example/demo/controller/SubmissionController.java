package com.example.demo.controller;

import com.example.demo.domain.Assignment;
import com.example.demo.dto.request.Assignment.CreateAssignmentDTO;
import com.example.demo.dto.request.Submission.SubmitSubmissionDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.AssignmentDTO.ReponseAssignmentForStudentDTO;
import com.example.demo.dto.response.SubmissionDTO.ReponseDetailSubmissionDTO;
import com.example.demo.service.AssignmentService;
import com.example.demo.service.SubmissionService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SubmissionController {
    private final SubmissionService submissionService;
    private final AssignmentService assignmentService;
    private final SecurityUtil securityUtil;
    @PostMapping("/student/assignments/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Submit Submission", description = "ceate a new assignment with the provided information")
    public ResponseEntity<ApiResponse<Void>> createAssignment(@RequestBody @Valid SubmitSubmissionDTO dto) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        submissionService.submitSubmission(dto, user);
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.CREATED, "Submit submission successfully", null, null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/submissions/{submissionId}")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "GetSubmissionResultByIdSubmission", description = "Get submission result by submission ID")
    public ResponseEntity<ApiResponse<ReponseDetailSubmissionDTO>> getSubssionResult(@Parameter Long submissionId) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ReponseDetailSubmissionDTO result=submissionService.getSubmissionsBySubmissionId(submissionId, user);
        ApiResponse<ReponseDetailSubmissionDTO> response = new ApiResponse<>(HttpStatus.OK, "Get submission result successfully", result, null);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("student/assigment/{assignmentId}/submission")
    @PreAuthorize("hasAnyRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "GetSubmissionResultByAssignmentID", description = "Get submission result by submission ID")
    public ResponseEntity<ApiResponse<ReponseDetailSubmissionDTO>> getSubssionResultByAssigmentId(@Parameter Long assignmentId) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ReponseDetailSubmissionDTO result=submissionService.getSubmissionsByAssigmentId(assignmentId, user);
        ApiResponse<ReponseDetailSubmissionDTO> response = new ApiResponse<>(HttpStatus.OK, "Get submission result successfully", result, null);
        return ResponseEntity.ok().body(response);
    }


}
