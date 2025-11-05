package com.example.lms.mapper;

import com.example.lms.dto.*;
import com.example.lms.entity.*;
import org.springframework.beans.BeanUtils;
import java.util.stream.Collectors;

public class MapperUtil {

    public static UserDTO toUserDTO(User u) {
        if (u == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setName(u.getName());
        dto.setAvatar(u.getAvatar());
        dto.setPhone(u.getPhone());
        dto.setLocked(u.isLocked());
        dto.setRole(u.getRole() == null ? null : u.getRole().name());
        return dto;
    }

    public static AdminDTO toAdminDTO(Admin admin) {
        if (admin == null) return null;
        AdminDTO dto = new AdminDTO();
        BeanUtils.copyProperties(toUserDTO(admin), dto);
        return dto;
    }

    public static TeacherDTO toTeacherDTO(Teacher t) {
        if (t == null) return null;
        TeacherDTO dto = new TeacherDTO();
        dto.setId(t.getId());
        dto.setEmail(t.getEmail());
        dto.setName(t.getName());
        dto.setAvatar(t.getAvatar());
        dto.setPhone(t.getPhone());
        dto.setLocked(t.isLocked());
        dto.setRole(t.getRole() == null ? null : t.getRole().name());
        dto.setTeacherId(t.getTeacherId());
        return dto;
    }

    public static StudentDTO toStudentDTO(Student s) {
        if (s == null) return null;
        StudentDTO dto = new StudentDTO();
        dto.setId(s.getId());
        dto.setEmail(s.getEmail());
        dto.setName(s.getName());
        dto.setAvatar(s.getAvatar());
        dto.setPhone(s.getPhone());
        dto.setLocked(s.isLocked());
        dto.setRole(s.getRole() == null ? null : s.getRole().name());
        dto.setStudentId(s.getStudentId());
        return dto;
    }

    public static CourseDTO toCourseDTO(Course c) {
        if (c == null) return null;
        CourseDTO dto = new CourseDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setCode(c.getCode());
        dto.setDescription(c.getDescription());
        dto.setCoverImage(c.getCoverImage());
        dto.setSemester(c.getSemester());
        dto.setEnrollmentCode(c.getEnrollmentCode());
        dto.setLocked(c.isLocked());
        dto.setTeacherId(c.getTeacher() == null ? null : c.getTeacher().getId());
        dto.setStudentCount(c.getStudentCount());
        if (c.getAssignments() != null) {
            dto.setAssignments(c.getAssignments().stream().map(MapperUtil::toAssignmentDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    public static AssignmentDTO toAssignmentDTO(Assignment a) {
        if (a == null) return null;
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setDueDate(a.getDueDate());
        dto.setMaxScore(a.getMaxScore());
        dto.setCourseId(a.getCourse() == null ? null : a.getCourse().getId());
        dto.setStatus(a.getStatus() == null ? null : a.getStatus().name());
        if (a.getSubmissions() != null) dto.setSubmissions(a.getSubmissions().stream().map(MapperUtil::toSubmissionDTO).collect(Collectors.toList()));
        return dto;
    }

    public static SubmissionDTO toSubmissionDTO(Submission s) {
        if (s == null) return null;
        SubmissionDTO dto = new SubmissionDTO();
        dto.setId(s.getId());
        dto.setAssignmentId(s.getAssignment() == null ? null : s.getAssignment().getId());
        dto.setStudentId(s.getStudent() == null ? null : s.getStudent().getId());
        dto.setSubmittedAt(s.getSubmittedAt());
        dto.setFileUrl(s.getFileUrl());
        dto.setFileName(s.getFileName());
        dto.setNotes(s.getNotes());
        dto.setScore(s.getScore());
        dto.setFeedback(s.getFeedback());
        dto.setStatus(s.getStatus() == null ? null : s.getStatus().name());
        return dto;
    }

    public static DocumentDTO toDocumentDTO(Document d) {
        if (d == null) return null;
        DocumentDTO dto = new DocumentDTO();
        dto.setId(d.getId());
        dto.setCourseId(d.getCourse() == null ? null : d.getCourse().getId());
        dto.setTitle(d.getTitle());
        dto.setType(d.getType() == null ? null : d.getType().name());
        dto.setUrl(d.getUrl());
        dto.setUploadedAt(d.getUploadedAt());
        dto.setCategory(d.getCategory());
        return dto;
    }

    public static DiscussionDTO toDiscussionDTO(Discussion d) {
        if (d == null) return null;
        DiscussionDTO dto = new DiscussionDTO();
        dto.setId(d.getId());
        dto.setCourseId(d.getCourse() == null ? null : d.getCourse().getId());
        dto.setAuthorId(d.getAuthor() == null ? null : d.getAuthor().getId());
        dto.setTitle(d.getTitle());
        dto.setContent(d.getContent());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setPinned(d.isPinned());
        if (d.getReplies() != null) dto.setReplies(d.getReplies().stream().map(MapperUtil::toReplyDTO).collect(Collectors.toList()));
        return dto;
    }

    public static ReplyDTO toReplyDTO(Reply r) {
        if (r == null) return null;
        ReplyDTO dto = new ReplyDTO();
        dto.setId(r.getId());
        dto.setDiscussionId(r.getDiscussion() == null ? null : r.getDiscussion().getId());
        dto.setAuthorId(r.getAuthor() == null ? null : r.getAuthor().getId());
        dto.setContent(r.getContent());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public static EnrollmentDTO toEnrollmentDTO(Enrollment e) {
        if (e == null) return null;
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(e.getId());
        dto.setCourseId(e.getCourse() == null ? null : e.getCourse().getId());
        dto.setStudentId(e.getStudent() == null ? null : e.getStudent().getId());
        dto.setEnrolledAt(e.getEnrolledAt());
        dto.setStatus(e.getStatus());
        return dto;
    }
}
