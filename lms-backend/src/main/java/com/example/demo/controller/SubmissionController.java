package com.example.demo.controller;

import com.example.demo.dto.request.submission.SubmitSubmissionDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.submissionDTO.ReponseDetailSubmissionDTO;
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

    // ==========================
    // SUBMIT ASSIGNMENT
    // ==========================
    @PostMapping("/student/assignments/submit")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Submit assignment",
            description = "Submit student's answers for an assignment"
    )
    public ResponseEntity<ApiResponse<Void>> submitSubmission(@RequestBody @Valid SubmitSubmissionDTO dto) {

        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not found"));

        submissionService.submitSubmission(dto, user);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Submit submission successfully",
                null,
                null
        );
        return ResponseEntity.ok().body(response);
    }

    // ==========================
    // GET SUBMISSION BY SUBMISSION ID
    // ==========================
    @GetMapping("/submissions/{submissionId}")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Get submission result by submission ID",
            description = "Return detailed submission result"
    )
    public ResponseEntity<ApiResponse<ReponseDetailSubmissionDTO>> getSubmissionResult(
            @PathVariable Long submissionId
    ) {

        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not found"));

        ReponseDetailSubmissionDTO result =
                submissionService.getSubmissionsBySubmissionId(submissionId, user);

        ApiResponse<ReponseDetailSubmissionDTO> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get submission result successfully",
                result,
                null
        );
        return ResponseEntity.ok().body(response);
    }

    // ==========================
    // GET SUBMISSION BY ASSIGNMENT ID
    // ==========================
    @GetMapping("/student/assignment/{assignmentId}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Get submission result by assignment ID",
            description = "Return student submission result for a specific assignment"
    )
    public ResponseEntity<ApiResponse<ReponseDetailSubmissionDTO>> getSubmissionResultByAssignmentId(
            @PathVariable Long assignmentId
    ) {

        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not found"));

        ReponseDetailSubmissionDTO result =
                submissionService.getSubmissionsByAssigmentId(assignmentId, user);

        ApiResponse<ReponseDetailSubmissionDTO> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get submission result successfully",
                result,
                null
        );
        return ResponseEntity.ok().body(response);
    }
}
