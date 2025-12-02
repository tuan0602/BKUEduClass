package com.example.demo.service;

import com.example.demo.domain.User;
import com.example.demo.dto.request.User.CreateUserRequest;
import com.example.demo.dto.response.ResLoginDTO;
import com.example.demo.dto.response.userDTO.ResUserDTO;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.errors.CustomException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    final private UserRepository userRepository;
    final private PasswordEncoder passwordEncoder;
    public User getUserByEmail(String email){
        return userRepository.findByEmail(email).orElse(null);
    }
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())){
            throw new CustomException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }
    public void updateUserToken(String token, String email) {

        User currentUser=userRepository.findByEmail(email).orElse(null);
        if (currentUser!=null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }
    public User getUserByEmailAndRefreshToken(String email, String refreshToken) {
        return userRepository.findByEmailAndRefreshToken(email,refreshToken).orElse(null);
    }


}
