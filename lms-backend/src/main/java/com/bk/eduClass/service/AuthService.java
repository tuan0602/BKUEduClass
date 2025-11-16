package com.bk.eduClass.service;

import com.bk.eduClass.dto.*;
import com.bk.eduClass.model.User;
import com.bk.eduClass.model.enums.Role;
import com.bk.eduClass.repository.UserRepository;
import com.bk.eduClass.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Giả lập token reset password trong memory (production dùng DB/Redis)
    private final Map<String, String> resetTokenStore = new HashMap<>();

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ---------------------- Đăng ký ----------------------
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email đã tồn tại");
        }

        // Chuyển String role từ DTO sang Enum
        Role userRole;
        try {
            userRole = Role.valueOf(dto.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new InvalidRoleException("Role không hợp lệ. Phải là ADMIN, TEACHER hoặc STUDENT");
        }

        // Tạo user mới
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setRole(userRole);

        // userId được tự động sinh trong @PrePersist của User model
        userRepository.save(user);

        // Tạo JWT
        String token = jwtUtil.generateToken(user.getUserId());

        return new AuthResponseDTO(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    // ---------------------- Đăng nhập ----------------------
    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email hoặc mật khẩu không đúng"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Email hoặc mật khẩu không đúng");
        }

        if (Boolean.TRUE.equals(user.getLocked())) {
            throw new AccountLockedException("Tài khoản đang bị khóa");
        }

        String token = jwtUtil.generateToken(user.getUserId());
        return new AuthResponseDTO(token, user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    // ---------------------- Đăng xuất ----------------------
    public void logout(String userId) {
        // JWT stateless → client tự xóa token
    }

    // ---------------------- Quên mật khẩu ----------------------
    public void forgotPassword(ForgotPasswordRequestDTO dto) {
        userRepository.findByEmail(dto.getEmail()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            resetTokenStore.put(resetToken, dto.getEmail());
            System.out.println("Reset password token (demo): " + resetToken);
        });
    }

    // ---------------------- Reset mật khẩu ----------------------
    public void resetPassword(ResetPasswordRequestDTO dto) {
        String email = Optional.ofNullable(resetTokenStore.get(dto.getToken()))
                .orElseThrow(() -> new InvalidTokenException("Token không hợp lệ hoặc đã hết hạn"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User không tồn tại"));

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        resetTokenStore.remove(dto.getToken());
    }

    // ---------------------- Lấy thông tin user hiện tại ----------------------
    public UserDTO getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User không tồn tại"));

        return new UserDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatar(),
                user.getPhone()
        );
    }

    // ---------------------- Custom Exceptions ----------------------
    public static class UserAlreadyExistsException extends RuntimeException {
        public UserAlreadyExistsException(String message) { super(message); }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) { super(message); }
    }

    public static class AccountLockedException extends RuntimeException {
        public AccountLockedException(String message) { super(message); }
    }

    public static class InvalidTokenException extends RuntimeException {
        public InvalidTokenException(String message) { super(message); }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) { super(message); }
    }

    public static class InvalidRoleException extends RuntimeException {
        public InvalidRoleException(String message) { super(message); }
    }
}
