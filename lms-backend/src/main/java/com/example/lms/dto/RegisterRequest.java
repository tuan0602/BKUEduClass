package com.example.lms.dto;

import lombok.Getter;
import lombok.Setter;
import com.example.lms.entity.User.Role;

@Getter
@Setter
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Role role; // ADMIN / TEACHER / STUDENT
}
