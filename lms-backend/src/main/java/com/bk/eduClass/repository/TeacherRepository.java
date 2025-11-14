package com.bk.eduClass.repository;

import com.bk.eduClass.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Optional<Teacher> findByUserUserId(String userId);
    List<Teacher> findByDepartment(String department);
}
