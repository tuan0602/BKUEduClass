package com.bk.eduClass.service;

import com.bk.eduClass.dto.request.CreateUserRequest;
import com.bk.eduClass.dto.request.UpdateUserRequest;
import com.bk.eduClass.dto.response.PageResponse;
import com.bk.eduClass.dto.response.UserResponse;
import com.bk.eduClass.exception.DuplicateResourceException;
import com.bk.eduClass.exception.ResourceNotFoundException;
import com.bk.eduClass.model.*;
import com.bk.eduClass.model.enums.Role;
import com.bk.eduClass.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy danh sách users với search, filter và pagination
     */
    public PageResponse<UserResponse> getUsers(
            String search,
            Role role,
            Boolean isLocked,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<User> userPage = userRepository.findUsersWithFilters(search, role, isLocked, pageable);
        
        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(this::mapToUserResponseWithDetails)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                userResponses,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    /**
     * Tạo user mới (Admin, Teacher, hoặc Student)
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        // 1. Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        // 2. Tạo User entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setLocked(false);

        // Save user
        user = userRepository.save(user);

        // 3. Tạo bảng con tương ứng theo role
        switch (request.getRole()) {
            case ADMIN:
                createAdminRecord(user);
                break;
            case TEACHER:
                createTeacherRecord(user, request);
                break;
            case STUDENT:
                createStudentRecord(user, request);
                break;
        }

        return mapToUserResponseWithDetails(user);
    }

    /**
     * Lấy chi tiết user theo ID
     */
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return mapToUserResponseWithDetails(user);
    }

    /**
     * Cập nhật thông tin user
     */
    @Transactional
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update basic info
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        // Update role nếu thay đổi
        if (request.getRole() != null && request.getRole() != user.getRole()) {
            updateUserRole(user, request.getRole(), request);
        } else {
            // Chỉ update thông tin bổ sung
            updateRoleSpecificInfo(user, request);
        }

        user = userRepository.save(user);
        return mapToUserResponseWithDetails(user);
    }

    /**
     * Xóa user
     */
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Xóa bảng con trước
        switch (user.getRole()) {
            case ADMIN:
                adminRepository.deleteByUser_UserId(userId);
                break;
            case TEACHER:
                teacherRepository.deleteByUser_UserId(userId);
                break;
            case STUDENT:
                studentRepository.deleteByUser_UserId(userId);
                break;
        }

        // Xóa user
        userRepository.delete(user);
    }

    /**
     * Khóa tài khoản user
     */
    @Transactional
    public UserResponse lockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        user.setLocked(true);
        user = userRepository.save(user);
        
        return mapToUserResponseWithDetails(user);
    }

    /**
     * Mở khóa tài khoản user
     */
    @Transactional
    public UserResponse unlockUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        user.setLocked(false);
        user = userRepository.save(user);
        
        return mapToUserResponseWithDetails(user);
    }

    // ============= PRIVATE HELPER METHODS =============

    private void createAdminRecord(User user) {
        Admin admin = new Admin();
        admin.setAdminId(UUID.randomUUID().toString());
        admin.setUser(user);
        adminRepository.save(admin);
    }

    private void createTeacherRecord(User user, CreateUserRequest request) {
        Teacher teacher = new Teacher();
        teacher.setTeacherId(UUID.randomUUID().toString());
        teacher.setUser(user);
        teacher.setDepartment(request.getDepartment());
        teacher.setHireDate(LocalDate.now());
        teacherRepository.save(teacher);
    }

    private void createStudentRecord(User user, CreateUserRequest request) {
        Student student = new Student();
        student.setStudentId(UUID.randomUUID().toString());
        student.setUser(user);
        student.setMajor(request.getMajor());
        student.setYear(request.getYear());
        student.setClassName(request.getClassName());
        studentRepository.save(student);
    }

    private void updateUserRole(User user, Role newRole, UpdateUserRequest request) {
        // Xóa record cũ
        switch (user.getRole()) {
            case ADMIN:
                adminRepository.deleteByUser_UserId(user.getUserId());
                break;
            case TEACHER:
                teacherRepository.deleteByUser_UserId(user.getUserId());
                break;
            case STUDENT:
                studentRepository.deleteByUser_UserId(user.getUserId());
                break;
        }

        // Update role
        user.setRole(newRole);

        // Tạo record mới
        CreateUserRequest createRequest = new CreateUserRequest();
        createRequest.setDepartment(request.getDepartment());
        createRequest.setMajor(request.getMajor());
        createRequest.setYear(request.getYear());
        createRequest.setClassName(request.getClassName());

        switch (newRole) {
            case ADMIN:
                createAdminRecord(user);
                break;
            case TEACHER:
                createTeacherRecord(user, createRequest);
                break;
            case STUDENT:
                createStudentRecord(user, createRequest);
                break;
        }
    }

    private void updateRoleSpecificInfo(User user, UpdateUserRequest request) {
        switch (user.getRole()) {
            case ADMIN:
                // Admin không có thông tin bổ sung cần update
                break;
            case TEACHER:
                teacherRepository.findByUser_UserId(user.getUserId()).ifPresent(teacher -> {
                    if (request.getDepartment() != null) {
                        teacher.setDepartment(request.getDepartment());
                        teacherRepository.save(teacher);
                    }
                });
                break;
            case STUDENT:
                studentRepository.findByUser_UserId(user.getUserId()).ifPresent(student -> {
                    if (request.getMajor() != null) student.setMajor(request.getMajor());
                    if (request.getYear() != null) student.setYear(request.getYear());
                    if (request.getClassName() != null) student.setClassName(request.getClassName());
                    studentRepository.save(student);
                });
                break;
        }
    }

/**
 * Map User entity sang UserResponse VÀ load thông tin từ bảng con
 */
private UserResponse mapToUserResponseWithDetails(User user) {
    UserResponse response = new UserResponse(user);

    // Lấy thông tin bổ sung theo role
    try {
        switch (user.getRole()) {
            case ADMIN:
                // Admin không có thông tin bổ sung
                break;
            case TEACHER:
                teacherRepository.findByUser_UserId(user.getUserId()).ifPresent(teacher -> {
                    response.setDepartment(teacher.getDepartment());
                });
                break;
            case STUDENT:
                studentRepository.findByUser_UserId(user.getUserId()).ifPresent(student -> {
                    response.setMajor(student.getMajor());
                    response.setYear(student.getYear());
                    response.setClassName(student.getClassName());
                });
                break;
        }
    } catch (Exception e) {
        // Log error nhưng vẫn trả về user basic info
        System.err.println("Error loading role-specific details: " + e.getMessage());
    }

    return response;
}
}