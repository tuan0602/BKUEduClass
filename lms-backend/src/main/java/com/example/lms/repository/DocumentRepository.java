package com.example.lms.repository;

import com.example.lms.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByCourseId(String courseId);
}
