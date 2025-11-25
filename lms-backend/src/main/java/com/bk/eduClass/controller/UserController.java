package com.bk.eduClass.controller;

import com.bk.eduClass.dto.request.CreateUserRequest;
import com.bk.eduClass.dto.request.UpdateUserRequest;
import com.bk.eduClass.dto.response.PageResponse;
import com.bk.eduClass.dto.response.UserResponse;
import com.bk.eduClass.model.enums.Role;
import com.bk.eduClass.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users - Danh sách users với search, filter và pagination
     * Query params:
     * - search: tìm kiếm theo email hoặc name
     * - role: filter theo role (ADMIN, TEACHER, STUDENT)
     * - isLocked: filter theo trạng thái khóa (true/false)
     * - page: số trang (default = 0)
     * - size: số items mỗi trang (default = 10)
     */
    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean isLocked,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<UserResponse> response = userService.getUsers(search, role, isLocked, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/users - Tạo user mới
     * Body: CreateUserRequest (JSON)
     * Required fields: email, password, name, role
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/users/:id - Chi tiết user
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/users/:id - Cập nhật user
     * Body: UpdateUserRequest (JSON)
     * Optional fields: email, name, role, phone, department, major, year, className
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/users/:id - Xóa user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/users/:id/lock - Khóa tài khoản user
     */
    @PatchMapping("/{id}/lock")
    public ResponseEntity<UserResponse> lockUser(@PathVariable String id) {
        UserResponse response = userService.lockUser(id);
        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/users/:id/unlock - Mở khóa tài khoản user
     */
    @PatchMapping("/{id}/unlock")
    public ResponseEntity<UserResponse> unlockUser(@PathVariable String id) {
        UserResponse response = userService.unlockUser(id);
        return ResponseEntity.ok(response);
    }
}