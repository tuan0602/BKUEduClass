package com.example.demo.controller;

import com.example.demo.domain.enumeration.EnrollmentStatus;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.service.CourseService;
import com.example.demo.service.EnrolmentService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@RequestMapping("/api")
public class EnrollmentController {
    final private EnrolmentService enrolmentService;
    final private SecurityUtil securityUtil;
    @PostMapping("/student/courses/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Enroll in a Course", description = "Enroll the current student in a specified course")
    public ResponseEntity<ApiResponse<Void>> enrollInCourse(@RequestParam String enrollmentCode) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        enrolmentService.enrollStudentInCourse(user, enrollmentCode);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"Enroll request sent successfully",null,null);
        return ResponseEntity.ok().body(response);
    }
    @PutMapping("/courses/enroll/{id}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Duyệt enroll", description = "Enroll the current student in a specified course")
    public ResponseEntity<ApiResponse<Void>> acceptEnroll(@PathVariable Long id) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        enrolmentService.enrollAnswer("accept", id);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"Enroll accepted successfully",null,null);
        return ResponseEntity.ok().body(response);
    }
    @PutMapping("/courses/enroll/{id}/refuse")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Duyệt enroll", description = "Enroll the current student in a specified course")
    public ResponseEntity<ApiResponse<Void>> refuseEnroll(@PathVariable Long id) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        enrolmentService.enrollAnswer("refuse", id);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"Enroll refused successfully",null,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/admin/enrolls")
    @PreAuthorize("hasAnyRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "GetListEnrolls", description = "Enroll the current student in a specified course")
    public ResponseEntity<ApiResponse<ResultPaginationDTO>> getCourses(
            @PageableDefault(size = 10,page=0,sort = "enrolledAt",direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String courseCode,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) EnrollmentStatus status
    ) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ResultPaginationDTO paginationDTO=enrolmentService.getEnrolls(pageable,courseName,courseCode,studentName,status,user);
        ApiResponse<ResultPaginationDTO> response=new ApiResponse<>(HttpStatus.OK,"get successful",paginationDTO,null);
        return ResponseEntity.ok().body(response);
    }
}
