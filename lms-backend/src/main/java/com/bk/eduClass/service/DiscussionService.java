package com.bk.eduClass.service;

import com.bk.eduClass.dto.DiscussionDTO;
import java.util.List;

public interface DiscussionService {
    DiscussionDTO getById(String discussionId);
    List<DiscussionDTO> getAll();
    DiscussionDTO create(DiscussionDTO discussionDTO);
    DiscussionDTO update(String discussionId, DiscussionDTO discussionDTO);
    void delete(String discussionId);
}
