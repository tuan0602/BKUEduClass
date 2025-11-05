package com.example.lms.service;

import com.example.lms.entity.Reply;
import com.example.lms.repository.ReplyRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class ReplyService {
    private final ReplyRepository replyRepository;

    @Autowired
    public ReplyService(ReplyRepository replyRepository) {
        this.replyRepository = replyRepository;
    }

    public List<Reply> findAll() { return replyRepository.findAll(); }
    public Optional<Reply> findById(String id) { return replyRepository.findById(id); }
    public Reply save(Reply r) { return replyRepository.save(r); }
    public void deleteById(String id) { replyRepository.deleteById(id); }

    public List<Reply> findByDiscussionId(String discussionId) {
        return replyRepository.findByDiscussionId(discussionId);
    }
}
