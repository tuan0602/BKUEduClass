//package com.example.demo.service;
//
//import com.example.demo.domain.Admin;
//import com.example.demo.domain.Student;
//import com.example.demo.domain.Teacher;
//import com.example.demo.domain.User;
//import com.example.demo.domain.enumeration.Role;
//import com.example.demo.dto.request.User.CreateUserRequest;
//import com.example.demo.dto.request.User.UpdateUserRequest;
//import com.example.demo.dto.response.ResultPaginationDTO;
//import com.example.demo.dto.response.userDTO.ResUserDTO;
//import com.example.demo.repository.AdminRepository;
//import com.example.demo.repository.StudentRepository;
//import com.example.demo.repository.TeacherRepository;
//import com.example.demo.repository.UserRepository;
//import com.example.demo.util.errors.CustomException;
//import com.example.demo.util.errors.DuplicateResourceException;
//import com.example.demo.util.errors.ResourceNotFoundException;
//import jakarta.persistence.criteria.Predicate;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.domain.Specification;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class UserService {
//    final private UserRepository userRepository;
//    final private PasswordEncoder passwordEncoder;
//
//    public User getUserByEmail(String email){
//        return userRepository.findByEmail(email).orElse(null);
//    }
//
//    /**
//     * Get list user with filter and pagination
//     * @param search
//     * @param role
//     * @param isLocked
//     * @param pageable
//     * @return
//     */
//    public ResultPaginationDTO getUsers(String search, Role role, Boolean isLocked, Pageable pageable) {
//        Specification<User> spec = (root, query, cb) -> {
//            Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
//            //Nếu Có filter
//            if (search != null && !search.isEmpty()) {
//                predicate = cb.and(predicate, cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"));
//            }
//            if (role != null) {
//                predicate = cb.and(predicate, cb.equal(root.get("role"), role));
//            }
//            if (isLocked != null) {
//                predicate = cb.and(predicate, cb.equal(root.get("isLocked"), isLocked));
//            }
//            return predicate;
//        };
//        Page<User> page= userRepository.findAll(spec, pageable);
//        List<ResUserDTO> result=page.getContent().stream().map(ResUserDTO::fromUser).collect(Collectors.toList());
//
//        ResultPaginationDTO resultPaginationDTO=new ResultPaginationDTO();
//        ResultPaginationDTO.Meta mt=new ResultPaginationDTO.Meta();
//
//        mt.setCurrentPage(page.getNumber());
//        mt.setPageSize(page.getSize());
//        mt.setTotalPages(page.getTotalPages());
//        mt.setTotalElements(page.getNumberOfElements());
//
//        resultPaginationDTO.setMeta(mt);
//        resultPaginationDTO.setResult(result);
//        return resultPaginationDTO;
//    }
//
//    /**
//     * get user by id
//     * @param userId
//     * @return
//     */
//    public ResUserDTO getUserById(String userId) {
//        User user=userRepository.findById(userId).orElseThrow(()-> new CustomException("User not found"));
//        return mapToUserResponseWithDetails(user);
//    }
//    /**
//     * Cập nhật thông tin user
//     */
//    @Transactional
//    public ResUserDTO updateUser(String userId, UpdateUserRequest request) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        // Update basic info
//        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
//            if (userRepository.existsByEmail(request.getEmail())) {
//                throw new DuplicateResourceException("Email already exists: " + request.getEmail());
//            }
//            user.setEmail(request.getEmail());
//        }
//
//        if (request.getName() != null) {
//            user.setName(request.getName());
//        }
//
//        if (request.getPhone() != null) {
//            user.setPhone(request.getPhone());
//        }
//
//        // Update role nếu thay đổi
//        if (request.getRole() != null && request.getRole() != user.getRole()) {
//            updateUserRole(user, request.getRole(), request);
//        } else {
//            // Chỉ update thông tin bổ sung
//            updateRoleSpecificInfo(user, request);
//        }
//
//        user = userRepository.save(user);
//        return mapToUserResponseWithDetails(user);
//    }
//
//
//    /**
//     * Tạo user mới (Admin, Teacher, hoặc Student)
//     */
//    @Transactional
//    public ResUserDTO createUser(CreateUserRequest request) {
//        // 1. Kiểm tra email đã tồn tại chưa
//        if (userRepository.existsByEmail(request.getEmail())) {
//            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
//        }
//
//        // 2. Tạo User entity
//        User user = new User();
//        user.setEmail(request.getEmail());
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//        user.setName(request.getName());
//        user.setRole(request.getRole());
//        user.setPhone(request.getPhone());
//        user.setLocked(false);
//
//        // Save user
//        user = userRepository.save(user);
//
//        // 3. Tạo bảng con tương ứng theo role
//        switch (request.getRole()) {
//            case ADMIN:
//                createAdminRecord(user);
//                break;
//            case TEACHER:
//                createTeacherRecord(user, request);
//                break;
//            case STUDENT:
//                createStudentRecord(user, request);
//                break;
//        }
//
//        return mapToUserResponseWithDetails(user);
//    }
//    /**
//     * Xóa user
//     */
//    @Transactional
//    public void deleteUser(String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        // Xóa bảng con trước
//        switch (user.getRole()) {
//            case ADMIN:
//                adminRepository.deleteByUser_UserId(userId);
//                break;
//            case TEACHER:
//                teacherRepository.deleteByUser_UserId(userId);
//                break;
//            case STUDENT:
//                studentRepository.deleteByUser_UserId(userId);
//                break;
//        }
//
//        // Xóa user
//        userRepository.delete(user);
//    }
//    /**
//     * Khóa tài khoản user
//     */
//    @Transactional
//    public ResUserDTO lockUser(String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        user.setLocked(true);
//        user = userRepository.save(user);
//
//        return mapToUserResponseWithDetails(user);
//    }
//
//    /**
//     * Mở khóa tài khoản user
//     */
//    @Transactional
//    public ResUserDTO unlockUser(String userId) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        user.setLocked(false);
//        user = userRepository.save(user);
//
//        return mapToUserResponseWithDetails(user);
//    }
//
//    private void createAdminRecord(User user) {
//        Admin admin = new Admin();
//        admin.setAdminId(UUID.randomUUID().toString());
//        admin.setUser(user);
//        adminRepository.save(admin);
//    }
//
//
//    // ============= PRIVATE HELPER METHODS =============
//
//    private void createTeacherRecord(User user, CreateUserRequest request) {
//        Teacher teacher = new Teacher();
//        teacher.setTeacherId(UUID.randomUUID().toString());
//        teacher.setUser(user);
//        teacher.setDepartment(request.getDepartment());
//        teacher.setHireDate(LocalDate.now());
//        teacherRepository.save(teacher);
//    }
//
//    private void createStudentRecord(User user, CreateUserRequest request) {
//        Student student = new Student();
//        student.setStudentId(UUID.randomUUID().toString());
//        student.setUser(user);
//        student.setMajor(request.getMajor());
//        student.setYear(request.getYear());
//        student.setClassName(request.getClassName());
//        studentRepository.save(student);
//    }
//    private void updateUserRole(User user, Role newRole, UpdateUserRequest request) {
//        // Xóa record cũ
//        switch (user.getRole()) {
//            case ADMIN:
//                adminRepository.deleteByUser_UserId(user.getUserId());
//                break;
//            case TEACHER:
//                teacherRepository.deleteByUser_UserId(user.getUserId());
//                break;
//            case STUDENT:
//                studentRepository.deleteByUser_UserId(user.getUserId());
//                break;
//        }
//
//        // Update role
//        user.setRole(newRole);
//
//        // Tạo record mới
//        CreateUserRequest createRequest = new CreateUserRequest();
//        createRequest.setDepartment(request.getDepartment());
//        createRequest.setMajor(request.getMajor());
//        createRequest.setYear(request.getYear());
//        createRequest.setClassName(request.getClassName());
//
//        switch (newRole) {
//            case ADMIN:
//                createAdminRecord(user);
//                break;
//            case TEACHER:
//                createTeacherRecord(user, createRequest);
//                break;
//            case STUDENT:
//                createStudentRecord(user, createRequest);
//                break;
//        }
//    }
//
//    private void updateRoleSpecificInfo(User user, UpdateUserRequest request) {
//
//    }
//
//
//
//
//}
