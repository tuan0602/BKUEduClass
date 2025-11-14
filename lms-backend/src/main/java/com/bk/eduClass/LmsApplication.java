package com.bk.eduClass;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Annotation này đánh dấu đây là Spring Boot Application
@SpringBootApplication
public class LmsApplication {

    public static void main(String[] args) {
        // SpringApplication.run sẽ khởi động toàn bộ context Spring Boot
        SpringApplication.run(LmsApplication.class, args);
    }
}
