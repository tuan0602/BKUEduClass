package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.DiscussionDTO;
import com.bk.eduClass.mapper.DiscussionMapper;
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
                .map(DiscussionMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<DiscussionDTO> getAll() {
        return discussionRepository.findAll()
                .stream()
                .map(DiscussionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DiscussionDTO create(DiscussionDTO dto) {
        Discussion discussion = DiscussionMapper.toEntity(dto);

        if (discussion.getCourse() != null && discussion.getCourse().getCourseId() != null) {
            courseRepository.findById(discussion.getCourse().getCourseId())
                    .ifPresent(discussion::setCourse);
        }

        if (discussion.getAuthor() != null && discussion.getAuthor().getUserId() != null) {
            userRepository.findById(discussion.getAuthor().getUserId())
                    .ifPresent(discussion::setAuthor);
        }

        discussion = discussionRepository.save(discussion);
        return DiscussionMapper.toDTO(discussion);
    }

    @Override
    public DiscussionDTO update(String discussionId, DiscussionDTO dto) {
        Discussion existing = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new IllegalArgumentException("Discussion not found"));

        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setPinned(dto.isPinned());

        if (dto.getCourseId() != null) {
            courseRepository.findById(dto.getCourseId())
                    .ifPresent(existing::setCourse);
        }

        if (dto.getAuthorId() != null) {
            userRepository.findById(dto.getAuthorId())
                    .ifPresent(existing::setAuthor);
        }

        existing = discussionRepository.save(existing);
        return DiscussionMapper.toDTO(existing);
    }

    @Override
    public void delete(String discussionId) {
        discussionRepository.deleteById(discussionId);
    }
}
