package com.bk.eduClass.service;

import com.bk.eduClass.dto.ReplyDTO;
import java.util.List;

public interface ReplyService {
    ReplyDTO getById(String replyId);
    List<ReplyDTO> getAll();
    ReplyDTO create(ReplyDTO replyDTO);
    ReplyDTO update(String replyId, ReplyDTO replyDTO);
    void delete(String replyId);
}
