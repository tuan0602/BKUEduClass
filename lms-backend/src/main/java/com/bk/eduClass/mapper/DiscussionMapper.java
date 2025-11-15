package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.DiscussionDTO;
import com.bk.eduClass.model.Course;
import com.bk.eduClass.model.Discussion;
import com.bk.eduClass.model.User;

import java.util.stream.Collectors;

public class DiscussionMapper {

    public static DiscussionDTO toDTO(Discussion discussion) {
        if (discussion == null) return null;

        return DiscussionDTO.builder()
                .discussionId(discussion.getDiscussionId())
                .courseId(discussion.getCourse() != null ? discussion.getCourse().getCourseId() : null)
                .authorId(discussion.getAuthor() != null ? discussion.getAuthor().getUserId() : null)
                .title(discussion.getTitle())
                .content(discussion.getContent())
                .createdAt(discussion.getCreatedAt())
                .pinned(discussion.getPinned() != null ? discussion.getPinned() : false)
                .replyIds(discussion.getReplies() != null ?
                        discussion.getReplies().stream()
                                .map(r -> r.getReplyId())
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static Discussion toEntity(DiscussionDTO dto) {
        if (dto == null) return null;

        Discussion discussion = new Discussion();
        discussion.setDiscussionId(dto.getDiscussionId());
        discussion.setTitle(dto.getTitle());
        discussion.setContent(dto.getContent());
        discussion.setPinned(dto.isPinned());
        discussion.setCreatedAt(dto.getCreatedAt());

        // Set placeholder entities; full fetch will be done in service
        if (dto.getCourseId() != null) {
            Course course = new Course();
            course.setCourseId(dto.getCourseId());
            discussion.setCourse(course);
        }

        if (dto.getAuthorId() != null) {
            User author = new User();
            author.setUserId(dto.getAuthorId());
            discussion.setAuthor(author);
        }

        return discussion;
    }
}
