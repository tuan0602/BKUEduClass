package com.example.demo.dto.request.User;

import com.example.demo.domain.enumeration.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    private Role role;

    private String phone;

    // Thông tin bổ sung theo role
    private String department;  // Cho Teacher
    private String major;       // Cho Student
    private Integer year;       // Cho Student
    private String className;   // Cho Student
}