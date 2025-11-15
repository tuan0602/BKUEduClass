package com.bk.eduClass.mapper;

import com.bk.eduClass.dto.ReplyDTO;
import com.bk.eduClass.model.Discussion;
import com.bk.eduClass.model.Reply;
import com.bk.eduClass.model.User;

public class ReplyMapper {

    public static ReplyDTO toDTO(Reply reply) {
        if (reply == null) return null;

        return ReplyDTO.builder()
                .replyId(reply.getReplyId())
                .discussionId(reply.getDiscussion() != null ? reply.getDiscussion().getDiscussionId() : null)
                .authorId(reply.getAuthor() != null ? reply.getAuthor().getUserId() : null)
                .content(reply.getContent())
                .createdAt(reply.getCreatedAt())
                .build();
    }

    public static Reply toEntity(ReplyDTO dto) {
        if (dto == null) return null;

        Reply reply = new Reply();
        reply.setReplyId(dto.getReplyId());
        reply.setContent(dto.getContent());
        reply.setCreatedAt(dto.getCreatedAt());

        // Tạo placeholder entities; fetch thật trong service
        if (dto.getDiscussionId() != null) {
            Discussion discussion = new Discussion();
            discussion.setDiscussionId(dto.getDiscussionId());
            reply.setDiscussion(discussion);
        }

        if (dto.getAuthorId() != null) {
            User author = new User();
            author.setUserId(dto.getAuthorId());
            reply.setAuthor(author);
        }

        return reply;
    }
}
