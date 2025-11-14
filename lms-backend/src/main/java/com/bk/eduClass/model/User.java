package com.bk.eduClass.model;

import com.bk.eduClass.model.enums.Role;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "User")
@Getter
@Setter
public class User {

    @Id
    private String userId;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String avatar;
    private String phone;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean locked = false;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;


    // getters & setters
}
