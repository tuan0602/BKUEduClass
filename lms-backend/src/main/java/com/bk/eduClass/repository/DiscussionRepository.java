package com.bk.eduClass.repository;

import com.bk.eduClass.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiscussionRepository extends JpaRepository<Discussion, String> {
    List<Discussion> findByCourseCourseId(String courseId);
    List<Discussion> findByAuthorUserId(String authorId);
}
