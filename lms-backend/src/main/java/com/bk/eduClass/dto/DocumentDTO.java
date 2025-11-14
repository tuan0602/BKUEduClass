package com.bk.eduClass.dto;

import com.bk.eduClass.model.enums.Type;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private String documentId;
    private String courseId;
    private String title;
    private Type type;
    private String url;
    private LocalDateTime uploadedAt;
    private String category;
}
