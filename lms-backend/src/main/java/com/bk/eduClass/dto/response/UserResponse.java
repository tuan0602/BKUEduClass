package com.bk.eduClass.dto.response;

import com.bk.eduClass.model.User;
import com.bk.eduClass.model.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

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
    public UserResponse(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole();
        this.avatar = user.getAvatar();
        this.phone = user.getPhone();
        this.locked = user.getLocked();
        this.createdAt = user.getCreatedAt();
    }
}