package com.bk.eduClass.dto.response;

import com.bk.eduClass.model.enums.Role;

public class AuthResponseDTO {
    private String token;
    private String userId;
    private String name;
    private String email;
    private Role role;

    public AuthResponseDTO(String token, String userId, String name, String email, Role role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // getters
    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
}
