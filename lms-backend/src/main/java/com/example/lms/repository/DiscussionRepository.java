package com.example.lms.repository;

import com.example.lms.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, String> {
    List<Discussion> findByCourseId(String courseId);
}
