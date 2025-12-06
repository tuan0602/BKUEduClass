package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UploadFileService {
    private final S3Client s3Client;
    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        // Sinh tên file mới: timestamp + random + extension
        int random = new Random().nextInt(10000); // 0 -> 9999
        String uniqueFilename = System.currentTimeMillis() + "_" + random + extension;

        // Key trong S3 = folder + "/" + tên file duy nhất
        String key = folder + "/" + uniqueFilename;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        return uniqueFilename;
    }
    public ResponseEntity<byte[]> downloadFile(String folder, String filename
    ) {
        String key = folder + "/" + filename;
        try {
            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(
                    GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build()
            );

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .body(objectBytes.asByteArray());

        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }
    public ResponseEntity<String> deleteFile(String folder,String filename)
    {
        String key = folder + "/" + filename;
        try {
            // Kiểm tra file tồn tại trước (tùy chọn)
            s3Client.headObject(builder -> builder.bucket(bucketName).key(key));

            // Xóa file
            s3Client.deleteObject(
                    DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build()
            );
            return ResponseEntity.ok("Deleted: " + key);
        } catch (software.amazon.awssdk.services.s3.model.NoSuchKeyException e) {
            return ResponseEntity.status(404).body("File not found: " + key);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting file: " + e.getMessage());
        }
    }
}
