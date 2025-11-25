package com.bk.eduClass.repository;

import com.bk.eduClass.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    
    // Tìm student theo userId
    Optional<Student> findByUser_UserId(String userId);
    
    // Xóa student theo userId
    void deleteByUser_UserId(String userId);
}