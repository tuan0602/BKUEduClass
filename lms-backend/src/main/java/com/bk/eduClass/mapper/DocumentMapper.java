package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.DocumentDTO;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.Document;

public class DocumentMapper {

    public static DocumentDTO toDTO(Document document) {
        if (document == null) return null;

        return DocumentDTO.builder()
                .documentId(document.getDocumentId())
                .courseId(document.getCourse() != null ? document.getCourse().getCourseId() : null)
                .title(document.getTitle())
                .type(document.getType())
                .url(document.getUrl())
                .uploadedAt(document.getUploadedAt())
                .category(document.getCategory())
                .build();
    }

    public static Document toEntity(DocumentDTO dto) {
        if (dto == null) return null;

        Document document = new Document();
        document.setDocumentId(dto.getDocumentId());
        document.setTitle(dto.getTitle());
        document.setType(dto.getType());
        document.setUrl(dto.getUrl());
        document.setUploadedAt(dto.getUploadedAt());
        document.setCategory(dto.getCategory());

        // Set course as a placeholder; full entity will be fetched in service
        if (dto.getCourseId() != null) {
            Course course = new Course();
            course.setCourseId(dto.getCourseId());
            document.setCourse(course);
        }

        return document;
    }
}
