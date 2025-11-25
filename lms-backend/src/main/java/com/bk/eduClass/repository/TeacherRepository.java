package com.bk.eduClass.repository;

import com.bk.eduClass.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, String> {
    
    // Tìm teacher theo userId
    Optional<Teacher> findByUser_UserId(String userId);
    
    // Xóa teacher theo userId
    void deleteByUser_UserId(String userId);
}