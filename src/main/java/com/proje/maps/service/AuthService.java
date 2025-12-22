package com.proje.maps.service;

import com.proje.maps.api.CustomUserDetails;
import com.proje.maps.dto.*;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.security.JwtUtil;

import com.proje.maps.resource.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    
    private final UserJpaRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    public AuthService(UserJpaRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil,
                      AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        
        User savedUser = userRepository.save(user);
        
        // CustomUserDetails kullan (User ID ile)
        UserDetails userDetails = new CustomUserDetails(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getPassword(),
                savedUser.getIsActive()
        );
        
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, "Bearer", mapToUserDTO(savedUser));
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // userDetails artık CustomUserDetails (ID ile)
        User user;
        if (userDetails instanceof CustomUserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
            user = userRepository.findById(customUserDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            // Fallback - email ile ara
            user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, "Bearer", mapToUserDTO(user));
    }
    
    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
