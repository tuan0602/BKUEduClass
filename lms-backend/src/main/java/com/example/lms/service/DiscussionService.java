package com.example.lms.service;

import com.example.lms.entity.Discussion;
import com.example.lms.repository.DiscussionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@Service
public class DiscussionService {
    private final DiscussionRepository discussionRepository;

    @Autowired
    public DiscussionService(DiscussionRepository discussionRepository) {
        this.discussionRepository = discussionRepository;
    }

    public List<Discussion> findAll() { return discussionRepository.findAll(); }
    public Optional<Discussion> findById(String id) { return discussionRepository.findById(id); }
    public Discussion save(Discussion d) { return discussionRepository.save(d); }
    public void deleteById(String id) { discussionRepository.deleteById(id); }

    // Business: fetch discussions by course
    public List<Discussion> findByCourseId(String courseId) {
        return discussionRepository.findByCourseId(courseId);
    }
}
