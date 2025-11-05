package com.example.lms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDTO extends UserDTO {
    private String teacherId;
}
