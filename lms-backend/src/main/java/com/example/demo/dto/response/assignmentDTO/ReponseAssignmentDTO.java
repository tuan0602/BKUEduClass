package com.example.demo.dto.response.assignmentDTO;

import com.example.demo.domain.Assignment;
import com.example.demo.domain.enumeration.StatusAssignment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReponseAssignmentDTO {
   private Long id;
   private String title;
   private String description;
   private LocalDateTime dueDate;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private StatusAssignment status;
   public static ReponseAssignmentDTO fromAssignment(Assignment assignment) {
         ReponseAssignmentDTO dto = new ReponseAssignmentDTO();
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
