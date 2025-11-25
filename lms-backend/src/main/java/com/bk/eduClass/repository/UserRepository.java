package com.bk.eduClass.repository;

import com.bk.eduClass.model.User;
import com.bk.eduClass.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Tìm user theo email
    Optional<User> findByEmail(String email);

    // Check email đã tồn tại chưa
    boolean existsByEmail(String email);

    // Search + Filter với Pagination
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isLocked IS NULL OR u.locked = :isLocked)")
    Page<User> findUsersWithFilters(
        @Param("search") String search,
        @Param("role") Role role,
        @Param("isLocked") Boolean isLocked,
        Pageable pageable
    );

    // Đếm số user theo role
    long countByRole(Role role);

    // Đếm số user bị locked
    long countByLocked(Boolean locked);
}