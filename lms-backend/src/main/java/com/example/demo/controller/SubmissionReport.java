package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.report.ProgressLearning;
import com.example.demo.service.ReportService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
public class SubmissionReport {
    final private SecurityUtil securityUtil;
    final private ReportService reportService;
    @GetMapping("/student/me")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Submit assignment",
            description = "Submit student's answers for an assignment"
    )
    public ResponseEntity<ApiResponse<ProgressLearning>> generateStudentReport() {
        // Implementation for generating student report
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ProgressLearning report =reportService.getResultLearningStudent(user);
        ApiResponse<ProgressLearning> response = new ApiResponse<>(
                org.springframework.http.HttpStatus.OK,
                "Student report generated successfully",
                report,
                null
        );
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/student/course/{id}/me")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(
            summary = "Submit assignment",
            description = "Submit student's answers for an assignment"
    )
    public ResponseEntity<ApiResponse<ProgressLearning>> generateStudentReportByCourseId(@PathVariable Long id) {
        // Implementation for generating student report
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ProgressLearning report =reportService.getResultLearningStudentByCourseId(user, id);
        ApiResponse<ProgressLearning> response = new ApiResponse<>(
                org.springframework.http.HttpStatus.OK,
                "Student report generated successfully",
                report,
                null
        );
        return ResponseEntity.ok().body(response);
    }
}
