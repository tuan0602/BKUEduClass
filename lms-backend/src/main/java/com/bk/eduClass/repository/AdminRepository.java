package com.bk.eduClass.repository;

import com.bk.eduClass.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
    
    // Tìm admin theo userId
    Optional<Admin> findByUser_UserId(String userId);
    
    // Xóa admin theo userId
    void deleteByUser_UserId(String userId);
}