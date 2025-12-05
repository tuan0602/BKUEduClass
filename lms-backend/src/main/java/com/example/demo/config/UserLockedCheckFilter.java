package com.example.demo.config;

import com.example.demo.domain.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.SecurityUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserLockedCheckFilter extends OncePerRequestFilter {
    
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request, 
            HttpServletResponse response, 
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Lấy email của user hiện tại từ JWT token
        Optional<String> currentUserEmail = SecurityUtil.getCurrentUserLogin();
        
        if (currentUserEmail.isPresent()) {
            // Kiểm tra user trong database
            Optional<User> userOpt = userRepository.findByEmail(currentUserEmail.get());
            
            if (userOpt.isPresent() && userOpt.get().isLocked()) {
                // User bị locked -> Clear SecurityContext và trả về lỗi
                SecurityContextHolder.clearContext();
                
                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.setContentType("application/json;charset=UTF-8");
                
                // Sử dụng ApiResponse giống format hiện tại của bạn
                String jsonResponse = objectMapper.writeValueAsString(
                    new ErrorResponse(
                        "403",
                        "Account is locked",
                        "Your account has been locked by administrator. Please contact support."
                    )
                );
                
                response.getWriter().write(jsonResponse);
                return; // Dừng filter chain, không cho request đi tiếp
            }
        }
        
        // User không bị locked hoặc chưa authenticate -> Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
    
    // Inner class để format response
    private static class ErrorResponse {
        public String statusCode;
        public String error;
        public String message;
        
        public ErrorResponse(String statusCode, String error, String message) {
            this.statusCode = statusCode;
            this.error = error;
            this.message = message;
        }
    }
}