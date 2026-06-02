package com.example.demo.dto.response.assignmentDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.example.demo.entity.Assignment;
import com.example.demo.entity.enumeration.StatusAssignment;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseAssignmentDTO {
   private Long id;
   private String title;
   private String description;
   private LocalDateTime dueDate;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private StatusAssignment status;
   public static ResponseAssignmentDTO fromAssignment(Assignment assignment) {
         ResponseAssignmentDTO dto = new ResponseAssignmentDTO();
         dto.id = assignment.getId();
         dto.title = assignment.getTitle();
         dto.description = assignment.getDescription();
         dto.dueDate = assignment.getDueDate();
         dto.createdAt = assignment.getCreatedAt();
         dto.updatedAt = assignment.getUpdatedAt();
         dto.status = assignment.getStatus();
         return dto;
   }

}
