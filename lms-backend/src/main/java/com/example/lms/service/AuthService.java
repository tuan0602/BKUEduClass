package com.example.lms.service;

import com.example.lms.entity.*;
import com.example.lms.repository.*;
import com.example.lms.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Đăng ký
    public Map<String, Object> register(String email, String password, String name, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // Xác định role hợp lệ
        User.Role userRole;
        try {
            userRole = User.Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Role không hợp lệ (chỉ nhận ADMIN, TEACHER, STUDENT)");
        }

        // Tạo user
        User user = new User() {}; // Vì User là abstract, nên tạo anonymous class
        user.setId(UUID.randomUUID().toString());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole(userRole);
        userRepository.save(user);

        // Tạo thực thể con tương ứng
        switch (userRole) {
            case STUDENT -> {
                Student student = new Student();
                student.setStudentId(UUID.randomUUID().toString());
                student.setUser(user);
                student.setMajor(null);
                student.setYear(null);
                student.setClassName(null);
                studentRepository.save(student);
            }
            case TEACHER -> {
                Teacher teacher = new Teacher();
                teacher.setTeacherId(UUID.randomUUID().toString());
                teacher.setUser(user);
                teacher.setDepartment(null);
                teacher.setHireDate(null);
                teacherRepository.save(teacher);
            }
            case ADMIN -> {
                Admin admin = new Admin();
                admin.setId(UUID.randomUUID().toString());
                admin.setUser(user);
                admin.setPermissions("DEFAULT");
                adminRepository.save(admin);
            }
        }

        // Trả về JWT token ngay sau khi đăng ký
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng ký thành công");
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("email", user.getEmail());
        return response;
    }

    // Đăng nhập
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (user.isLocked()) {
            throw new RuntimeException("Tài khoản bị khóa");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công");
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("email", user.getEmail());
        return response;
    }
    public Map<String, Object> getUserInfoByEmail(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

    Map<String, Object> data = new HashMap<>();
    data.put("id", user.getId());
    data.put("email", user.getEmail());
    data.put("name", user.getName());
    data.put("role", user.getRole().name());
    data.put("avatar", user.getAvatar());
    data.put("phone", user.getPhone());
    return data;
}

// Lấy email từ token (sử dụng bean JwtTokenProvider đã được inject)
public String extractEmailFromToken(String token) {
    if (token == null || token.isBlank()) {
        throw new RuntimeException("Token không hợp lệ");
    }
    if (!jwtTokenProvider.validateToken(token)) {
        throw new RuntimeException("Token không hợp lệ");
    }
    return jwtTokenProvider.getEmailFromToken(token);
}

}
