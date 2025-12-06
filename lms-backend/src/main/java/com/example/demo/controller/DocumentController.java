package com.example.demo.controller;

import com.example.demo.domain.Document;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.service.DocumentService;
import com.example.demo.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;
    private final SecurityUtil securityUtil;
    @PostMapping(value = "/courses/{courseid}/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Upload Document to a Course", description = "")
    public ResponseEntity<ApiResponse<Void>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long courseid,
            @RequestParam String title
    ) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        documentService.uploadDocumentToCourse(file, user, courseid,title);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.CREATED,"Document uploaded successfully",null,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping(value = "/courses/{courseid}/documents/{documentid}/download")
    @PreAuthorize("hasAnyRole('TEACHER','STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "DownloadDocument", description = "")
    public ResponseEntity<byte[]>  downloadDocument(
            @RequestParam Long documentid,
            @RequestParam Long courseid
    ) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        ResponseEntity<byte[]>  document=documentService.downloadFile(documentid, user);
        return document;
    }
    @GetMapping("/courses/{courseid}/documents")
    @PreAuthorize("hasAnyRole('TEACHER','STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get all documents of a course", description = "")
    public ResponseEntity<ApiResponse<List<Document>>> getAllDocumentsOfCourse(@PathVariable Long courseid) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        List<Document> documents=documentService.getAllDocumentsOfCourse(courseid, user);
        ApiResponse<List<Document>> response=new ApiResponse<>(HttpStatus.OK,"Get documents successfully",documents,null);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/courses/{courseid}/documents/{documentid}")
    @PreAuthorize("hasAnyRole('TEACHER','STUDENT')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get detail document", description = "")
    public ResponseEntity<ApiResponse<Document>> getAllDocumentsOfCourse(@PathVariable Long documentid,@PathVariable Long courseid) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        Document documents=documentService.getDocumentDetail(documentid, user);
        ApiResponse<Document> response=new ApiResponse<>(HttpStatus.OK,"Get document detail successfully",documents,null);
        return ResponseEntity.ok().body(response);
    }
    @DeleteMapping("/courses/{courseid}/documents/{documentid}")
    @PreAuthorize("hasRole('TEACHER')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Delete document", description = "")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long documentid,@PathVariable Long courseid) {
        String user = securityUtil.getCurrentUserLogin()
                .orElseThrow(()-> new RuntimeException("User not found"));
        documentService.deleteDocument(documentid, user);
        ApiResponse<Void> response=new ApiResponse<>(HttpStatus.OK,"Delete document successfully",null,null);
        return ResponseEntity.ok().body(response);
    }

}
