package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.DocumentDTO;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.Document;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.DocumentRepository;
import com.bk.eduClass.service.DocumentService;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final CourseRepository courseRepository;

    public DocumentServiceImpl(DocumentRepository documentRepository,
                               CourseRepository courseRepository) {
        this.documentRepository = documentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public DocumentDTO getById(String documentId) {
        return documentRepository.findById(documentId)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<DocumentDTO> getAll() {
        return documentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO create(DocumentDTO documentDTO) {
        Document document = toEntity(documentDTO);
        Objects.requireNonNull(document, "Document entity is null");
        document = documentRepository.save(document);
        return toDTO(document);
    }

    @Override
    public DocumentDTO update(String documentId, DocumentDTO documentDTO) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        
        document.setTitle(documentDTO.getTitle());
        document.setType(documentDTO.getType());
        document.setUrl(documentDTO.getUrl());
        document.setUploadedAt(documentDTO.getUploadedAt());
        document.setCategory(documentDTO.getCategory());

        documentRepository.save(document);
        return toDTO(document);
    }

    @Override
    public void delete(String documentId) {
        documentRepository.deleteById(documentId);
    }

    private DocumentDTO toDTO(Document document) {
        return DocumentDTO.builder()
                .documentId(document.getDocumentId())
                .courseId(document.getCourse().getCourseId())
                .title(document.getTitle())
                .type(document.getType())
                .url(document.getUrl())
                .uploadedAt(document.getUploadedAt())
                .category(document.getCategory())
                .build();
    }

    private Document toEntity(DocumentDTO dto) {
        Document document = new Document();
        document.setDocumentId(dto.getDocumentId());
        document.setTitle(dto.getTitle());
        document.setType(dto.getType());
        document.setUrl(dto.getUrl());
        document.setUploadedAt(dto.getUploadedAt());
        document.setCategory(dto.getCategory());

        courseRepository.findById(dto.getCourseId()).ifPresent(document::setCourse);

        return document;
    }
}
