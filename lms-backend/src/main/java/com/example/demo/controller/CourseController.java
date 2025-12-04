package com.example.demo.controller;

import com.example.demo.domain.Course;
import com.example.demo.dto.request.Course.CourseDTO;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.CourseDTO.ReponseDetailCourseDTO;
import com.example.demo.dto.response.ResultPaginationDTO;
import com.example.demo.service.CourseService;
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
public class CourseController {
    final private CourseService courseService;
    final private SecurityUtil securityUtil;
    @PostMapping("/admin/courses")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Create Course", description = "create a new user with the provided information")
    public ResponseEntity<ApiResponse<Course>> getUser(@RequestBody CourseDTO courseDTO) {
        Course course=courseService.createCourse(courseDTO);
        ApiResponse<Course> response=new ApiResponse<>(HttpStatus.CREATED,"create successful",course,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/courses")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get danh sách course cho cả teacher, student, admin luôn", description = "create a new user with the provided information")
    public ResponseEntity<ApiResponse<ResultPaginationDTO>> getCourses(
            @PageableDefault(size = 10,page=0,sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) String courseName,
            @RequestParam(required = false) String teacherName,
            @RequestParam(required = false) String courseCode
    ) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ResultPaginationDTO paginationDTO=courseService.getCourses(pageable,courseName,teacherName,courseCode,user);
        ApiResponse<ResultPaginationDTO> response=new ApiResponse<>(HttpStatus.OK,"get successful",paginationDTO,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/courses/{courseId}")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get detail course cho cả teacher, student, admin luôn", description = "create a new user with the provided information")
    public ResponseEntity<ApiResponse<ReponseDetailCourseDTO>> getCoursesDetail(@PathVariable Long courseId){
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ReponseDetailCourseDTO result=courseService.getCoursesDetail(courseId,user);
        ApiResponse<ReponseDetailCourseDTO> response=new ApiResponse<>(HttpStatus.OK,"get successful",result,null);
        return ResponseEntity.ok().body(response);
    }
    @DeleteMapping("/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Delete course", description = "create a new user with the provided information")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long courseId){
        courseService.deleteCourse(courseId);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"delete successful",null,null);
        return ResponseEntity.ok().body(response);
    }
    @PutMapping("/admin/courses/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Update Course", description = "create a new user with the provided information")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable Long courseId,@RequestBody CourseDTO courseDTO) {
        Course course = courseService.updateCourse(courseId, courseDTO);
        ApiResponse<Course> response = new ApiResponse<>(HttpStatus.OK, "update successful", course, null);
        return ResponseEntity.ok().body(response);
    }
}
