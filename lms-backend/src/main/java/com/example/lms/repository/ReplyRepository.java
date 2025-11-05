package com.example.lms.repository;

import com.example.lms.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, String> {
    List<Reply> findByDiscussionId(String discussionId);
}
