package com.bk.eduClass.repository;

import com.bk.eduClass.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByUserUserId(String userId);
}
