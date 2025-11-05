package com.example.lms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO extends UserDTO {
    private String studentId;
}
