package com.bk.eduClass.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    private String email;
    private String password;
    private String name;
    private String role;  // String, convert sang Enum trong service
}
