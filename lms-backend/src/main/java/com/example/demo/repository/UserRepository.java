package com.example.demo.repository;

import com.example.demo.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
   Optional<User> findByEmail(String email);

   boolean existsByEmail(String email);
   Optional<User> findByEmailAndRefreshToken(String email,String refreshToken);
   Page<User> findAll(Specification<User> specification, Pageable pageable);
}

