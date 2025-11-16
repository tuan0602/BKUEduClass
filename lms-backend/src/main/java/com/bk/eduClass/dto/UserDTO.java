package com.bk.eduClass.dto;

import com.bk.eduClass.model.enums.Role;

public class UserDTO {
    private String userId;
    private String name;
    private String email;
    private Role role;
    private String avatar;
    private String phone;

    public UserDTO(String userId, String name, String email, Role role, String avatar, String phone) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
        this.phone = phone;
    }

    // getters
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getAvatar() { return avatar; }
    public String getPhone() { return phone; }
}
