package com.bk.eduClass.repository;

import com.bk.eduClass.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByCourseCourseId(String courseId);
}
