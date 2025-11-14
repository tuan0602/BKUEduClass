package com.bk.eduClass.repository;

import com.bk.eduClass.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, String> {
    List<Reply> findByDiscussionDiscussionId(String discussionId);
    List<Reply> findByAuthorUserId(String authorId);
}
