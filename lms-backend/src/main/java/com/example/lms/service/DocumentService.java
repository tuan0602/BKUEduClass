package com.example.lms.service;

import com.example.lms.entity.Document;
import com.example.lms.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> findAll() { return documentRepository.findAll(); }
    public Optional<Document> findById(String id) { return documentRepository.findById(id); }
    public Document save(Document d) { return documentRepository.save(d); }
    public void deleteById(String id) { documentRepository.deleteById(id); }

    public List<Document> findByCourseId(String courseId) { return documentRepository.findByCourseId(courseId); }
}
