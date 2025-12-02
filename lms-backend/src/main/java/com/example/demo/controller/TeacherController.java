// package com.example.demo.controller;

// import com.example.demo.domain.User;
// import com.example.demo.domain.enumeration.Role;
// import com.example.demo.dto.response.ApiResponse;
// import com.example.demo.dto.response.ResultPaginationDTO;
// import com.example.demo.service.UserService;
// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
// import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.domain.Sort;
// import org.springframework.data.web.PageableDefault;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/techers")
// @RequiredArgsConstructor
// public class TeacherController {
//     final private UserService userService;
//     @GetMapping
//     @PreAuthorize("hasRole('TEACHER')")
//     @SecurityRequirement(name = "BearerAuth")
//     @Operation(summary = "Get all user", description = "create a new user with the provided information")
//     public ResponseEntity<ApiResponse<ResultPaginationDTO>> getUsers(
//             @PageableDefault(size = 10,page=0,sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
//             @RequestParam(required = false) String search,
//             @RequestParam(required = false) Role role,
//             @RequestParam(required = false) Boolean isLocked){
//         ResultPaginationDTO resultPaginationDTO = userService.getUsers(search,role,isLocked, pageable);
//         ApiResponse<ResultPaginationDTO> response=new ApiResponse<>(HttpStatus.OK,"get all users successful ",resultPaginationDTO,null);
//         return ResponseEntity.ok().body(response);
//     }
// }
