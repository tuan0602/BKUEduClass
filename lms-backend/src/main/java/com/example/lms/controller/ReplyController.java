package com.example.lms.controller;

import com.example.lms.dto.ReplyDTO;
import com.example.lms.entity.Reply;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/replies")
public class ReplyController {
    private final ReplyService replyService;

    @Autowired
    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    @GetMapping
    public ResponseEntity<List<ReplyDTO>> list() {
        List<ReplyDTO> dtos = replyService.findAll().stream().map(MapperUtil::toReplyDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReplyDTO> get(@PathVariable String id) {
        return replyService.findById(id).map(MapperUtil::toReplyDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReplyDTO> create(@RequestBody ReplyDTO dto) {
        Reply r = new Reply();
        r.setId(dto.getId());
        r.setContent(dto.getContent());
        r.setCreatedAt(dto.getCreatedAt());
        Reply saved = replyService.save(r);
        return ResponseEntity.ok(MapperUtil.toReplyDTO(saved));
    }

    @GetMapping("/by-discussion/{discussionId}")
    public ResponseEntity<List<ReplyDTO>> byDiscussion(@PathVariable String discussionId) {
        List<ReplyDTO> dtos = replyService.findByDiscussionId(discussionId).stream().map(MapperUtil::toReplyDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
