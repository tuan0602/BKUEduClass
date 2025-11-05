package com.example.lms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String email;
    private String name;
    private String avatar;
    private String phone;
    private String role;
    private boolean isLocked;
}
