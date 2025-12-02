package com.example.demo.dto.request.User;

import com.example.demo.domain.enumeration.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Role is required")
    private Role role;

    private String phone;

    // Thông tin bổ sung theo role
    private String department;  // Cho Teacher
    private String major;       // Cho Student
    private Integer year;       // Cho Student
    private String className;   // Cho Student
}