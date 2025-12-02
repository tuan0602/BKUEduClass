package com.example.demo.dto.response.userDTO;

import com.example.demo.domain.User;
import com.example.demo.domain.enumeration.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResUserDTO {

    private String userId;
    private String email;
    private String name;
    private Role role;
    private String avatar;
    private String phone;
    private Boolean locked;
    private LocalDateTime createdAt;

    // Thông tin bổ sung theo role
    private String department;  // Teacher
    private String major;       // Student
    private Integer year;       // Student
    private String className;   // Student

    // Constructor từ User entity
    public ResUserDTO(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole();
        this.avatar = user.getAvatar();
        this.phone = user.getPhone();
        this.locked = user.getLocked();
        this.createdAt = user.getCreatedAt();
    }
    public static ResUserDTO fromUser(User user) {
        return new ResUserDTO(user);
    }
}