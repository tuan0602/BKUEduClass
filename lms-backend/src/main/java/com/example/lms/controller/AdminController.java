package com.example.lms.controller;

import com.example.lms.dto.AdminDTO;
import com.example.lms.entity.Admin;
import com.example.lms.entity.User;
import com.example.lms.mapper.MapperUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import com.example.lms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admins")
public class AdminController {
    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AdminDTO>> list() {
        List<AdminDTO> dtos = userService.findAll().stream()
            .filter(u -> u.getRole() == User.Role.ADMIN)
            .map(admin -> MapperUtil.toAdminDTO((Admin) admin))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<AdminDTO> create(@RequestBody AdminDTO adminDTO) {
        // Set role to ADMIN explicitly for security
        adminDTO.setRole("ADMIN");
        
        Admin admin = new Admin();
        BeanUtils.copyProperties(adminDTO, admin);
        admin.setRole(User.Role.ADMIN);
        
        User savedUser = userService.save(admin);
        return ResponseEntity.ok(MapperUtil.toAdminDTO((Admin) savedUser));
    }
}
