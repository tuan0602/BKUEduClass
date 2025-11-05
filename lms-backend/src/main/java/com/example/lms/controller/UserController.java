package com.example.lms.controller;

import com.example.lms.dto.UserDTO;
import com.example.lms.entity.User;
import com.example.lms.mapper.MapperUtil;
import com.example.lms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> list() {
        List<UserDTO> dtos = userService.findAll().stream().map(MapperUtil::toUserDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable String id) {
        return userService.findById(id).map(MapperUtil::toUserDTO).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        User u = new User(){}; // anonymous concrete because User is abstract; caller should use specific subclass in practice
        u.setId(dto.getId());
        u.setEmail(dto.getEmail());
        u.setName(dto.getName());
        u.setAvatar(dto.getAvatar());
        u.setPhone(dto.getPhone());
        u.setLocked(dto.isLocked());
        User saved = userService.save(u);
        return ResponseEntity.ok(MapperUtil.toUserDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
