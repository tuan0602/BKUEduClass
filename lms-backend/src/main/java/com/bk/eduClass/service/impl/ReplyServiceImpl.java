package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.ReplyDTO;
import com.bk.eduClass.model.Reply;
import com.bk.eduClass.repository.ReplyRepository;
import com.bk.eduClass.repository.DiscussionRepository;
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
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public List<ReplyDTO> getAll() {
        return replyRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReplyDTO create(ReplyDTO replyDTO) {
        Reply reply = toEntity(replyDTO);
        reply = replyRepository.save(reply);
        return toDTO(reply);
    }

    @Override
    public ReplyDTO update(String replyId, ReplyDTO replyDTO) {
        Reply reply = replyRepository.findById(replyId).orElseThrow();
        reply.setContent(replyDTO.getContent());
        reply = replyRepository.save(reply);
        return toDTO(reply);
    }

    @Override
    public void delete(String replyId) {
        replyRepository.deleteById(replyId);
    }

    private ReplyDTO toDTO(Reply reply) {
        return ReplyDTO.builder()
                .replyId(reply.getReplyId())
                .discussionId(reply.getDiscussion().getDiscussionId())
                .authorId(reply.getAuthor().getUserId())
                .content(reply.getContent())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    private Reply toEntity(ReplyDTO dto) {
        Reply reply = new Reply();
        reply.setReplyId(dto.getReplyId());
        reply.setContent(dto.getContent());

        discussionRepository.findById(dto.getDiscussionId())
                .ifPresent(reply::setDiscussion);

        userRepository.findById(dto.getAuthorId())
                .ifPresent(reply::setAuthor);

        return reply;
    }
}
