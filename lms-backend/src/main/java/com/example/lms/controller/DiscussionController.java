package com.example.lms.controller;

import com.example.lms.dto.*;
import com.example.lms.entity.Discussion;
import com.example.lms.entity.Reply;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.DiscussionService;
import com.example.lms.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {
    private final DiscussionService discussionService;
    private final ReplyService replyService;

    @Autowired
    public DiscussionController(DiscussionService discussionService, ReplyService replyService) {
        this.discussionService = discussionService;
        this.replyService = replyService;
    }

    @GetMapping
    public ResponseEntity<List<DiscussionDTO>> list() {
        List<DiscussionDTO> dtos = discussionService.findAll().stream().map(MapperUtil::toDiscussionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscussionDTO> get(@PathVariable String id) {
        return discussionService.findById(id).map(MapperUtil::toDiscussionDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DiscussionDTO> create(@RequestBody DiscussionDTO dto) {
        Discussion d = new Discussion();
        d.setId(dto.getId());
        d.setTitle(dto.getTitle());
        d.setContent(dto.getContent());
        d.setPinned(dto.isPinned());
        Discussion saved = discussionService.save(d);
        return ResponseEntity.ok(MapperUtil.toDiscussionDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        discussionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Extra endpoint: /discussions/{id}/replies
    @GetMapping("/{id}/replies")
    public ResponseEntity<List<ReplyDTO>> getReplies(@PathVariable String id) {
        List<Reply> replies = replyService.findByDiscussionId(id);
        List<ReplyDTO> dtos = replies.stream().map(MapperUtil::toReplyDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
