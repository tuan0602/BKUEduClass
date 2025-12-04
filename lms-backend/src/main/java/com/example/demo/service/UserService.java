 package com.example.demo.service;

 import com.example.demo.domain.User;
 import com.example.demo.domain.enumeration.Role;
 import com.example.demo.dto.request.user.CreateUserRequest;
 import com.example.demo.dto.request.user.UpdateUserRequest;
 import com.example.demo.dto.response.ResultPaginationDTO;
 import com.example.demo.dto.response.userDTO.ResUserDTO;

 import com.example.demo.repository.UserRepository;
 import com.example.demo.util.errors.CustomException;
 import com.example.demo.util.errors.DuplicateResourceException;
 import com.example.demo.util.errors.ResourceNotFoundException;
 import jakarta.persistence.criteria.Predicate;
 import lombok.RequiredArgsConstructor;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.Pageable;
 import org.springframework.data.jpa.domain.Specification;
 import org.springframework.security.crypto.password.PasswordEncoder;
 import org.springframework.stereotype.Service;
 import org.springframework.transaction.annotation.Transactional;

 import java.util.List;
 import java.util.stream.Collectors;

 @Service
 @RequiredArgsConstructor
 public class UserService {
     final private UserRepository userRepository;
     final private PasswordEncoder passwordEncoder;

     public User getUserByEmail(String email){
         return userRepository.findByEmail(email).orElse(null);
     }

     /**
      * Get list user with filter and pagination
      * @param search
      * @param role
      * @param isLocked
      * @param pageable
      * @return
      */
     public ResultPaginationDTO getUsers(String search, Role role, Boolean isLocked, Pageable pageable) {
         Specification<User> spec = (root, query, cb) -> {
             Predicate predicate = cb.conjunction(); // bắt đầu với điều kiện luôn đúng
             //Nếu Có filter
             if (search != null && !search.isEmpty()) {
                 predicate = cb.and(predicate, cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"));
             }
             if (role != null) {
                 predicate = cb.and(predicate, cb.equal(root.get("role"), role));
             }
             if (isLocked != null) {
                 predicate = cb.and(predicate, cb.equal(root.get("isLocked"), isLocked));
             }
             return predicate;
         };
         Page<User> page= userRepository.findAll(spec, pageable);
         List<ResUserDTO> result=page.getContent().stream().map(ResUserDTO::fromUser).collect(Collectors.toList());

         ResultPaginationDTO resultPaginationDTO=new ResultPaginationDTO();
         ResultPaginationDTO.Meta mt=new ResultPaginationDTO.Meta();

         mt.setCurrentPage(page.getNumber());
         mt.setPageSize(page.getSize());
         mt.setTotalPages(page.getTotalPages());
         mt.setTotalElements(page.getNumberOfElements());

         resultPaginationDTO.setMeta(mt);
         resultPaginationDTO.setResult(result);
         return resultPaginationDTO;
     }

     /**
      * get user by id
      * @param userId
      * @return
      */
     public ResUserDTO getUserById(String userId) {
         User user=userRepository.findById(userId).orElseThrow(()-> new CustomException("User not found"));
         return ResUserDTO.fromUser(user);
     }
     /**
      * Cập nhật thông tin user
      */
     @Transactional
     public ResUserDTO updateUser(String userId, UpdateUserRequest request) {
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
         if (request.getName() != null) {
             user.setName(request.getName());
         }

         if (request.getPhone() != null) {
             user.setPhone(request.getPhone());
         }

         // Update role nếu thay đổi
         if (request.getRole() != null && request.getRole() != user.getRole()) {
             updateUserRole(user, request.getRole(), request);
         }

         user = userRepository.save(user);
         return ResUserDTO.fromUser(user);
     }


     /**
      * Tạo user mới (Admin, Teacher, hoặc Student)
      */
     @Transactional
     public ResUserDTO createUser(CreateUserRequest request) {
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


         return ResUserDTO.fromUser(user);
     }

     @Transactional
     public void deleteUser(String userId) {
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
         userRepository.delete(user);
     }

     @Transactional
     public ResUserDTO lockUser(String userId) {
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

         user.setLocked(true);
         user = userRepository.save(user);

         return ResUserDTO.fromUser(user);
     }


     @Transactional
     public ResUserDTO unlockUser(String userId) {
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

         user.setLocked(false);
         user = userRepository.save(user);

         return ResUserDTO.fromUser(user);
     }


     private void updateUserRole(User user, Role newRole, UpdateUserRequest request) {
         // Xóa record cũ


         // Update role
         user.setRole(newRole);


     }





 }
