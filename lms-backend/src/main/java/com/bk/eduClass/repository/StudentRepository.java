package com.bk.eduClass.repository;

import com.bk.eduClass.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByUserUserId(String userId);
    List<Student> findByMajor(String major);
}
