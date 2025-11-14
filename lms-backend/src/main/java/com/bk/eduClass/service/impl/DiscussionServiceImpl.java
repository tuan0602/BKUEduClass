package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.DiscussionDTO;
import com.bk.eduClass.model.Discussion;
import com.bk.eduClass.repository.CourseRepository;
import com.bk.eduClass.repository.DiscussionRepository;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.DiscussionService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiscussionServiceImpl implements DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public DiscussionServiceImpl(DiscussionRepository discussionRepository,
                                 CourseRepository courseRepository,
                                 UserRepository userRepository) {
        this.discussionRepository = discussionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DiscussionDTO getById(String discussionId) {
        return discussionRepository.findById(discussionId)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<DiscussionDTO> getAll() {
        return discussionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DiscussionDTO create(DiscussionDTO dto) {
        Discussion discussion = toEntity(dto);
        discussion = discussionRepository.save(discussion);
        return toDTO(discussion);
    }

    @Override
    public DiscussionDTO update(String discussionId, DiscussionDTO dto) {
        Discussion discussion = discussionRepository.findById(discussionId).orElseThrow();
        discussion.setTitle(dto.getTitle());
        discussion.setContent(dto.getContent());
        discussion.setPinned(dto.isPinned());
        discussion = discussionRepository.save(discussion);
        return toDTO(discussion);
    }

    @Override
    public void delete(String discussionId) {
        discussionRepository.deleteById(discussionId);
    }

    private DiscussionDTO toDTO(Discussion discussion) {
        return DiscussionDTO.builder()
                .discussionId(discussion.getDiscussionId())
                .courseId(discussion.getCourse().getCourseId())
                .authorId(discussion.getAuthor().getUserId())
                .title(discussion.getTitle())
                .content(discussion.getContent())
                .createdAt(discussion.getCreatedAt())
                .pinned(discussion.getPinned())
                .replyIds(discussion.getReplies() != null ?
                          discussion.getReplies().stream()
                                    .map(r -> r.getReplyId())
                                    .collect(Collectors.toList()) : null)
                .build();
    }

    private Discussion toEntity(DiscussionDTO dto) {
        Discussion discussion = new Discussion();
        discussion.setDiscussionId(dto.getDiscussionId());
        discussion.setTitle(dto.getTitle());
        discussion.setContent(dto.getContent());
        discussion.setPinned(dto.isPinned());
        discussion.setCreatedAt(dto.getCreatedAt());

        courseRepository.findById(dto.getCourseId()).ifPresent(discussion::setCourse);
        userRepository.findById(dto.getAuthorId()).ifPresent(discussion::setAuthor);

        return discussion;
    }
}
