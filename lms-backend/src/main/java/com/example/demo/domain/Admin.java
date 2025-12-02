package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
@Table(name = "Admin")
public class Admin {

    @Id
    private String adminId;

    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String permissions;

    // getters & setters
}
