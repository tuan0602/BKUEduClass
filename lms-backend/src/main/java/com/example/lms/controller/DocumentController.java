package com.example.lms.controller;

import com.example.lms.dto.DocumentDTO;
import com.example.lms.entity.Document;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentDTO>> list() {
        List<DocumentDTO> dtos = documentService.findAll().stream().map(MapperUtil::toDocumentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentDTO> get(@PathVariable String id) {
        return documentService.findById(id).map(MapperUtil::toDocumentDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<DocumentDTO>> byCourse(@PathVariable String courseId) {
        List<DocumentDTO> dtos = documentService.findByCourseId(courseId).stream().map(MapperUtil::toDocumentDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<DocumentDTO> create(@RequestBody DocumentDTO dto) {
        Document d = new Document();
        d.setId(dto.getId());
        d.setTitle(dto.getTitle());
        d.setUrl(dto.getUrl());
        d.setCategory(dto.getCategory());
        Document saved = documentService.save(d);
        return ResponseEntity.ok(MapperUtil.toDocumentDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        documentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
