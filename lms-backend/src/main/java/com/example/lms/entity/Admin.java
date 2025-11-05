package com.example.lms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Admins")
@Getter
@Setter
@NoArgsConstructor
public class Admin {

    @Id
    @Column(name = "adminId", length = 36)
    private String id;

    @OneToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String permissions;

    // Convenience constructor
    public Admin(String id, User user, String permissions) {
        this.id = id;
        this.user = user;
        this.permissions = permissions;
    }
}
