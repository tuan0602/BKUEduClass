package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.UserDTO;
import com.bk.eduClass.mapper.UserMapper;
import com.bk.eduClass.model.User;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.UserService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @PostConstruct
public void testDB() {
    try {
        long count = userRepository.count();
        System.out.println(">>> DB OK, user count = " + count);
    } catch (Exception e) {
        System.out.println(">>> DB ERROR: " + e.getMessage());
    }
}

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);   // DTO → Entity
        User saved = userRepository.save(user);
        return userMapper.toDTO(saved);             // Entity → DTO
    }

    @Override
    public UserDTO getUserById(String userId) {
        return userRepository.findById(userId)
                .map(userMapper::toDTO)
                .orElse(null);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDTO)
                .orElse(null);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // update entity bằng mapper
        userMapper.updateEntity(user, userDTO);

        User updated = userRepository.save(user);
        return userMapper.toDTO(updated);
    }

    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
