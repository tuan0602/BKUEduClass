 package com.example.demo.config;

 import com.example.demo.service.AuthService;
 import org.springframework.security.core.authority.SimpleGrantedAuthority;
 import org.springframework.security.core.userdetails.User;
 import org.springframework.security.core.userdetails.UserDetails;
 import org.springframework.security.core.userdetails.UserDetailsService;
 import org.springframework.security.core.userdetails.UsernameNotFoundException;
 import org.springframework.stereotype.Component;

 import java.util.Collections;

 @Component("userDetailsCustom")
 public class UserDetailsCustom implements UserDetailsService {
     private final AuthService authService;
     public UserDetailsCustom(AuthService authService) {
            this.authService = authService;
     }


     @Override
     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
         com.example.demo.domain.User user= authService.getUserByEmail(username);
         if (user==null)
             throw new UsernameNotFoundException(username);

         User us= new User(
                 user.getEmail(),
                 user.getPassword(),
                 Collections.singletonList(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()))
         );
         return us;
     }
 }
