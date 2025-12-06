package com.example.demo.service;

import com.example.demo.domain.Course;
import com.example.demo.domain.Document;
import com.example.demo.domain.User;
import com.example.demo.repository.CourseEnrollmentRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.DocumentRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {
    final private UploadFileService uploadFileService;
    final private CourseRepository courseRepository;
    final private DocumentRepository documentRepository;
    final private UserRepository userRepository;
    final private CourseEnrollmentRepository courseEnrollmentRepository;
    public void uploadDocumentToCourse(MultipartFile file, String userMail, Long courseId,String title) {
        User user=userRepository.findByEmail(userMail).orElseThrow(()-> new RuntimeException("User not found"));
        Course course=courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found"));
        if (!course.getTeacher().getEmail().equals(userMail)) {
            throw new RuntimeException("User not in course");
        }
        try {
            String key = uploadFileService.uploadFile(file, "documents");
            Document document=new Document();
            document.setTitle(title);
            document.setUploader(user);
            document.setCourse(course);
            document.setFileUrl(key);
            documentRepository.save(document);

        } catch (IOException e) {
            e.printStackTrace();
            // Xử lý lỗi: thông báo, log, hoặc ném RuntimeException
            throw new RuntimeException("Upload file failed", e);
        }
    }
    public ResponseEntity<byte[]> downloadFile(Long id,String userMail) {
        User user=userRepository.findByEmail(userMail).orElseThrow(()-> new RuntimeException("User not found"));
        Document document=documentRepository.findById(id).orElseThrow(()-> new RuntimeException("Document not found"));

        switch (user.getRole()){
            case STUDENT:
                boolean isEnrolled=courseEnrollmentRepository.existsByStudentAndCourseAndStatus(user,document.getCourse(), com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
                if(!isEnrolled){
                    throw new RuntimeException("User not enrolled in course");
                }
                break;
            case TEACHER:
                if(!document.getCourse().getTeacher().getEmail().equals(userMail)){
                    throw new RuntimeException("User not in course");
                }
                break;
            default:
                throw new RuntimeException("Invalid user role");
        }
        try {
            ResponseEntity<byte[]> file= uploadFileService.downloadFile("documents", document.getFileUrl());
            return file;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Download file failed", e);
        }
    }
    public List<Document> getAllDocumentsOfCourse(Long courseId,String userMail) {
        User user=userRepository.findByEmail(userMail).orElseThrow(()-> new RuntimeException("User not found"));
        Course course=courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found"));
        switch (user.getRole()){
            case STUDENT:
                boolean isEnrolled=courseEnrollmentRepository.existsByStudentAndCourseAndStatus(user,course, com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
                if(!isEnrolled){
                    throw new RuntimeException("User not enrolled in course");
                }
                break;
            case TEACHER:
                if(!course.getTeacher().getEmail().equals(userMail)){
                    throw new RuntimeException("User not in course");
                }
                break;
            default:
                throw new RuntimeException("Invalid user role");
        }
        List<Document> documents=documentRepository.findAllByCourse(course);
        return documents;

    }
    public Document getDocumentDetail(Long documentId,String userMail) {
        User user=userRepository.findByEmail(userMail).orElseThrow(()-> new RuntimeException("User not found"));
        Document document=documentRepository.findById(documentId).orElseThrow(()-> new RuntimeException("Document not found"));
        switch (user.getRole()){
            case STUDENT:
                boolean isEnrolled=courseEnrollmentRepository.existsByStudentAndCourseAndStatus(user,document.getCourse(), com.example.demo.domain.enumeration.EnrollmentStatus.ACCEPTED);
                if(!isEnrolled){
                    throw new RuntimeException("User not enrolled in course");
                }
                break;
            case TEACHER:
                if(!document.getCourse().getTeacher().getEmail().equals(userMail)){
                    throw new RuntimeException("User not in course");
                }
                break;
            default:
                throw new RuntimeException("Invalid user role");
        }
        return document;
    }
    public void deleteDocument(Long documentId, String userMail) {
        User user=userRepository.findByEmail(userMail).orElseThrow(()-> new RuntimeException("User not found"));
        Document document=documentRepository.findById(documentId).orElseThrow(()-> new RuntimeException("Document not found"));
        if(!document.getUploader().getEmail().equals(userMail)){
            throw new RuntimeException("User not uploader");
        }
        try {
            uploadFileService.deleteFile("documents", document.getFileUrl());
            documentRepository.delete(document);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Delete file failed", e);
        }
    }

}
