package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.ReplyDTO;
import com.bk.eduClass.mapper.ReplyMapper;
import com.bk.eduClass.model.Reply;
import com.bk.eduClass.repository.DiscussionRepository;
import com.bk.eduClass.repository.ReplyRepository;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.ReplyService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;
    private final DiscussionRepository discussionRepository;
    private final UserRepository userRepository;

    public ReplyServiceImpl(ReplyRepository replyRepository,
                            DiscussionRepository discussionRepository,
                            UserRepository userRepository) {
        this.replyRepository = replyRepository;
        this.discussionRepository = discussionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ReplyDTO getById(String replyId) {
        return replyRepository.findById(replyId)
                .map(ReplyMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<ReplyDTO> getAll() {
        return replyRepository.findAll()
                .stream()
                .map(ReplyMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReplyDTO create(ReplyDTO dto) {
        Reply reply = ReplyMapper.toEntity(dto);

        if (reply.getDiscussion() != null && reply.getDiscussion().getDiscussionId() != null) {
            discussionRepository.findById(reply.getDiscussion().getDiscussionId())
                    .ifPresent(reply::setDiscussion);
        }

        if (reply.getAuthor() != null && reply.getAuthor().getUserId() != null) {
            userRepository.findById(reply.getAuthor().getUserId())
                    .ifPresent(reply::setAuthor);
        }

        reply = replyRepository.save(reply);
        return ReplyMapper.toDTO(reply);
    }

    @Override
    public ReplyDTO update(String replyId, ReplyDTO dto) {
        Reply existing = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("Reply not found"));

        existing.setContent(dto.getContent());

        if (dto.getDiscussionId() != null) {
            discussionRepository.findById(dto.getDiscussionId())
                    .ifPresent(existing::setDiscussion);
        }

        if (dto.getAuthorId() != null) {
            userRepository.findById(dto.getAuthorId())
                    .ifPresent(existing::setAuthor);
        }

        existing = replyRepository.save(existing);
        return ReplyMapper.toDTO(existing);
    }

    @Override
    public void delete(String replyId) {
        replyRepository.deleteById(replyId);
    }
}
