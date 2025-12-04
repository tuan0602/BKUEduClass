 package com.example.demo.controller;

 import com.example.demo.domain.enumeration.Role;
 import com.example.demo.dto.request.user.CreateUserRequest;
 import com.example.demo.dto.request.user.UpdateUserRequest;
 import com.example.demo.dto.response.ApiResponse;
 import com.example.demo.dto.response.ResultPaginationDTO;
 import com.example.demo.dto.response.userDTO.ResUserDTO;
 import com.example.demo.service.UserService;
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
 @RequestMapping("/api/users")
 @RequiredArgsConstructor
 public class UserController {
     final private UserService userService;
     @GetMapping
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     @Operation(summary = "Get all user", description = "create a new user with the provided information")
     public ResponseEntity<ApiResponse<ResultPaginationDTO>> getUsers(
         @PageableDefault(size = 10,page=0,sort = "createdAt",direction = Sort.Direction.ASC) Pageable pageable,
         @RequestParam(required = false) String search,
         @RequestParam(required = false) Role role,
         @RequestParam(required = false) Boolean isLocked){
         ResultPaginationDTO resultPaginationDTO = userService.getUsers(search,role,isLocked, pageable);
         ApiResponse<ResultPaginationDTO> response=new ApiResponse<>(HttpStatus.OK,"get all users successful ",resultPaginationDTO,null);
         return ResponseEntity.ok().body(response);
     }
     @PostMapping
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<ResUserDTO>> createUser(@Valid @RequestBody CreateUserRequest request) {
         ResUserDTO response = userService.createUser(request);
         ApiResponse<ResUserDTO> apiResponse = new ApiResponse<>(HttpStatus.CREATED, "User created successfully", response, null);
         return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
     }
     /**
      * GET /api/users/:id - Chi tiết user
      */
     @GetMapping("/{id}")
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<ResUserDTO>> getUserById(@PathVariable String id) {
         ResUserDTO response = userService.getUserById(id);
         ApiResponse<ResUserDTO> apiResponse = new ApiResponse<>(HttpStatus.OK, "User retrieved successfully", response, null);
         return ResponseEntity.ok().body(apiResponse);
     }

     /**
      * PUT /api/users/:id - Cập nhật user
      * Body: UpdateUserRequest (JSON)
      * Optional fields: email, name, role, phone, department, major, year, className
      */
     @PutMapping("/{id}")
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<ResUserDTO>> updateUser(
             @PathVariable String id,
             @Valid @RequestBody UpdateUserRequest request
     ) {
         ResUserDTO response = userService.updateUser(id, request);
         ApiResponse<ResUserDTO> apiResponse = new ApiResponse<>(HttpStatus.OK, "User updated successfully", response, null);
         return ResponseEntity.ok().body(apiResponse);
     }

     /**
      * DELETE /api/users/:id - Xóa user
      */
     @DeleteMapping("/{id}")
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
         userService.deleteUser(id);
         ApiResponse<String> apiResponse = new ApiResponse<>(HttpStatus.OK, "User deleted successfully", null, null);
         return ResponseEntity.ok().body(apiResponse);
     }

     /**
      * PATCH /api/users/:id/lock - Khóa tài khoản user
      */
     @PatchMapping("/{id}/lock")
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<ResUserDTO>> lockUser(@PathVariable String id) {
         ResUserDTO response = userService.lockUser(id);
         ApiResponse<ResUserDTO> apiResponse = new ApiResponse<>(HttpStatus.OK, "User locked successfully", response, null);
         return ResponseEntity.ok().body(apiResponse);
     }

     /**
      * PATCH /api/users/:id/unlock - Mở khóa tài khoản user
      */
     @PatchMapping("/{id}/unlock")
     @PreAuthorize("hasRole('ADMIN')")
     @SecurityRequirement(name = "BearerAuth")
     public ResponseEntity<ApiResponse<ResUserDTO>> unlockUser(@PathVariable String id) {
         ResUserDTO response = userService.unlockUser(id);
         ApiResponse<ResUserDTO> apiResponse = new ApiResponse<>(HttpStatus.OK, "User unlocked successfully", response, null);
         return ResponseEntity.ok().body(apiResponse);
     }
 }
