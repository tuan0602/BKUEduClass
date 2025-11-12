package com.example.lms.security;

import com.example.lms.entity.User;
import com.example.lms.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // Spring Security sẽ truyền "username" (ở đây chúng ta sử dụng email làm username)
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

    return new org.springframework.security.core.userdetails.User(
        user.getEmail(),
        user.getPassword(),
        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
    );
    }
}
