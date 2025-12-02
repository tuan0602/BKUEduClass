package com.example.demo.dto.response;


import com.example.demo.domain.enumeration.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResLoginDTO {
    @JsonProperty("access_token")
    private  String accessToken;
    private UserLogin user;
    private Role role;



    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class UserLogin{
        private String id;
        private String email;
        private String name;
        private Role role;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class UserGetAccount{
        private UserLogin user;

    }
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInsideToken{
        private String id;
        private String email;
        private String name;
    }
}
