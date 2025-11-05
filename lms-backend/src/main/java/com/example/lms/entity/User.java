package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.*;

@Entity
@Table(name = "Users") // tránh lỗi reserved word
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
public abstract class User {

    @Id
    @Column(name = "userId", length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String name;

    private String avatar;
    private String phone;

    @Column(name = "isLocked")
    private boolean isLocked = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "createdAt", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Discussion> discussions = new ArrayList<>();

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Reply> replies = new ArrayList<>();

    public enum Role {
        ADMIN, TEACHER, STUDENT
    }

    public User(String id, String email, String password, String name, Role role) {
        this(id, email, password, name, null, null, false, role);
    }

    public User(String id, String email, String password, String name,
                String avatar, String phone, boolean isLocked, Role role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.avatar = avatar;
        this.phone = phone;
        this.isLocked = isLocked;
        this.role = role;
    }
}
