package com.bk.eduClass.repository;

import com.bk.eduClass.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, String> {
    List<Assignment> findByCourseCourseId(String courseId);
}
