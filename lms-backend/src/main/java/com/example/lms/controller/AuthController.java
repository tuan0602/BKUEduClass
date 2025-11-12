package com.example.lms.controller;

import com.example.lms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép frontend gọi API từ domain khác
public class AuthController {

    @Autowired
    private AuthService authService;

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        String role = request.get("role");

        Map<String, Object> response = authService.register(email, password, name, role);
        return ResponseEntity.ok(response);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> response = authService.login(email, password);
        return ResponseEntity.ok(response);
    }

    // Lấy thông tin người dùng hiện tại (me)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        // token dạng "Bearer eyJhbGciOiJIUzI1NiIs..."
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        // Gọi AuthService để lấy email từ token
        String email = authService.extractEmailFromToken(token);
        Map<String, Object> userData = authService.getUserInfoByEmail(email);

        return ResponseEntity.ok(userData);
    }
}
