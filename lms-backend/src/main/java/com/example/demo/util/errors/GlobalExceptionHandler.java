package com.example.demo.util.errors;


import com.example.demo.dto.response.ApiResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========XỬ LÝ CHO USER MANAGEMENT ==========

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Not Found: " + ex.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<String> handleDuplicateResource(DuplicateResourceException ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Duplicate: " + ex.getMessage());
    }


    // Bắt lỗi khi JSON không parse được (ví dụ enum sai, JSON sai cú pháp)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        ex.printStackTrace(); // log full stacktrace
        String message = ex.getMostSpecificCause().getMessage();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("JSON parse error: " + message);
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<?>> handleCustomException(CustomException ex) {
        ApiResponse<Object> res=new ApiResponse<>();
        res.setStatusCode(Integer.toString(HttpStatus.BAD_REQUEST.value()));
        res.setError(ex.getMessage());
        res.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    // Bắt lỗi enum không hợp lệ
    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<String> handleInvalidFormatException(InvalidFormatException ex) {
        ex.printStackTrace();
        String fieldName = ex.getPath().get(0).getFieldName();
        String targetType = ex.getTargetType().getSimpleName();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Invalid value for field '" + fieldName + "'. Expected type: " + targetType);
    }

    // Bắt tất cả lỗi còn lại
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleOtherExceptions(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unexpected error: " + ex.getMessage());
    }
    // Lỗi validate
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errorList = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        String errors = String.join("; ", errorList);
        ApiResponse<Object> response = new ApiResponse<>(HttpStatus.INTERNAL_SERVER_ERROR, errors, null, "VALIDATION_ERROR");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value={
            UsernameNotFoundException.class,
            BadCredentialsException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleIdExeption(Exception ex) {
        ApiResponse<Object> res=new ApiResponse<>();
        res.setStatusCode(Integer.toString(HttpStatus.BAD_REQUEST.value()));
        res.setError(ex.getMessage());
        res.setMessage("Thông tin đăng nhập không hợp lệ ...");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Object>> handleSecurityException(SecurityException ex) {
        ApiResponse<Object> res = new ApiResponse<>();
        res.setStatusCode(Integer.toString(HttpStatus.FORBIDDEN.value())); // 403
        res.setError(ex.getMessage());
        res.setMessage("Bạn không có quyền thực hiện hành động này");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

}