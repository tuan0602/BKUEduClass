package com.bk.eduClass.service.impl;

import com.bk.eduClass.dto.UserDTO;
import com.bk.eduClass.model.User;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setAvatar(user.getAvatar());
        dto.setPhone(user.getPhone());
        dto.setLocked(user.getLocked());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private User toEntity(UserDTO dto) {
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setRole(dto.getRole());
        user.setAvatar(dto.getAvatar());
        user.setPhone(dto.getPhone());
        user.setLocked(dto.getLocked());
        return user;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = userRepository.save(toEntity(userDTO));
        return toDTO(user);
    }

    @Override
    public UserDTO getUserById(String userId) {
        return userRepository.findById(userId).map(this::toDTO).orElse(null);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toDTO).orElse(null);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        User user = userRepository.save(toEntity(userDTO));
        return toDTO(user);
    }

    @Override
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
