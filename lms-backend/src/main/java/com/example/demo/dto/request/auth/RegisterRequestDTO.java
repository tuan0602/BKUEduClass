package com.example.demo.dto.request.auth;

import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email not invalid", regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    private String email;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank
    private String name;

    @NotBlank(message = "Role must not be blank")
    @Pattern(regexp = "USER|ADMIN|TEACHER", message = "Role must be USER or ADMIN or Teacher")
    private String role;

    public User createDTOToUser(){
        User user = new User();
        user.setEmail(this.email);
        user.setPassword(this.password);
        user.setName(this.name);

        // Chuyển String sang Enum trước khi lưu
        user.setRole(Role.valueOf(this.role));
        return user;
    }
}
