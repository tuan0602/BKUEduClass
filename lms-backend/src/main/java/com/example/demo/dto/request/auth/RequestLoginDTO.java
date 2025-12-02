package com.example.demo.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestLoginDTO {
    @NotBlank(message = "Khong duoc de trong username")
    public String email;
    @NotBlank(message = "Khong duoc de trong password")
    public String password;
}
