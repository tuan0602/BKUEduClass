package com.bk.eduClass.service;

import com.bk.eduClass.dto.DocumentDTO;
import java.util.List;

public interface DocumentService {
    DocumentDTO getById(String documentId);
    List<DocumentDTO> getAll();
    DocumentDTO create(DocumentDTO documentDTO);
    DocumentDTO update(String documentId, DocumentDTO documentDTO);
    void delete(String documentId);
}
