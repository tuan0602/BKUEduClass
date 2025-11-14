package com.bk.eduClass.dto;

import com.bk.eduClass.model.enums.Role;
import com.bk.eduClass.model.User;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private String userId;
    private String email;
    private String name;
    private Role role;
    private String avatar;
    private String phone;
    private Boolean locked;
    private LocalDateTime createdAt;

    // Getters & Setters
}
