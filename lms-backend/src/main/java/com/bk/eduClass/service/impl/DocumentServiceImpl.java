package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.DocumentDTO;
import com.bk.eduClass.mapper.DocumentMapper;
import com.bk.eduClass.model.Document;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.DocumentRepository;
import com.bk.eduClass.service.DocumentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
                .map(DocumentMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<DocumentDTO> getAll() {
        return documentRepository.findAll()
                .stream()
                .map(DocumentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DocumentDTO create(DocumentDTO documentDTO) {
        Document document = DocumentMapper.toEntity(documentDTO);

        // Set full Course from DB if exists
        if (document.getCourse() != null && document.getCourse().getCourseId() != null) {
            courseRepository.findById(document.getCourse().getCourseId())
                    .ifPresent(document::setCourse);
        }

        Objects.requireNonNull(document, "Document entity is null");
        document = documentRepository.save(document);
        return DocumentMapper.toDTO(document);
    }

    @Override
    public DocumentDTO update(String documentId, DocumentDTO documentDTO) {
        Document existing = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        existing.setTitle(documentDTO.getTitle());
        existing.setType(documentDTO.getType());
        existing.setUrl(documentDTO.getUrl());
        existing.setUploadedAt(documentDTO.getUploadedAt());
        existing.setCategory(documentDTO.getCategory());

        if (documentDTO.getCourseId() != null) {
            courseRepository.findById(documentDTO.getCourseId())
                    .ifPresent(existing::setCourse);
        }

        existing = documentRepository.save(existing);
        return DocumentMapper.toDTO(existing);
    }

    @Override
    public void delete(String documentId) {
        documentRepository.deleteById(documentId);
    }
}
