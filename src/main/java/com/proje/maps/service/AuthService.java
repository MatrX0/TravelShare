package com.proje.maps.service;

import com.proje.maps.api.CustomUserDetails;
import com.proje.maps.dto.*;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.security.JwtUtil;
import com.proje.maps.resource.PasswordResetToken;
import com.proje.maps.resource.User;

import java.time.LocalDateTime;
import java.util.Random;
import com.proje.maps.repo.PasswordResetTokenRepository;
import com.proje.maps.resource.PasswordResetToken;
import java.time.LocalDateTime;
import java.util.Optional;

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
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    
    public AuthService(UserJpaRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil,
                      AuthenticationManager authenticationManager,
                      PasswordResetTokenRepository passwordResetTokenRepository,
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
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
        
        // ✅ Mevcut kodu kullan, sonra wrap et
        UserDetails baseUserDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPassword())
                .authorities("USER")
                .build();
        
        // ✅ CustomUserDetails ile wrap et (ID ekle)
        CustomUserDetails userDetails = new CustomUserDetails(baseUserDetails, savedUser.getId());
        
        String token = jwtUtil.generateToken(baseUserDetails); // Base UserDetails kullan (mevcut kod bozulmasın)
        
        return new AuthResponse(token, "Bearer", mapToUserDTO(savedUser));
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails baseUserDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(baseUserDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(baseUserDetails); // Base UserDetails kullan (mevcut kod bozulmasın)
        
        return new AuthResponse(token, "Bearer", mapToUserDTO(user));
    }
    
    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setRole(user.getRole());
        return dto;
    }

    // Password Reset Token oluştur ve email gönder
    @Transactional
    public String requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Eski tokenları sil
        passwordResetTokenRepository.deleteByUser(user);
        
        // Yeni token oluştur (6 haneli kod)
        String token = generateResetToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15); // 15 dakika geçerli
        
        PasswordResetToken resetToken = new PasswordResetToken(user, token, expiresAt);
        passwordResetTokenRepository.save(resetToken);
        
        System.out.println("Password reset token for " + email + ": " + token);
        
        // Email gönder (async)
        try {
            emailService.sendPasswordResetEmail(email, user.getName(), token);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Email gönderilmese bile token'ı döndür (fallback)
        }
        
        // Token'ı döndür (frontend için)
        return token;
    }
    
    // Token'ı doğrula
    public boolean verifyResetToken(String email, String token) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<PasswordResetToken> resetTokenOpt = 
            passwordResetTokenRepository.findByToken(token);
        
        if (resetTokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = resetTokenOpt.get();
        
        // Token kullanıcıya ait mi?
        if (!resetToken.getUser().getId().equals(user.getId())) {
            return false;
        }
        
        // Token kullanılmış mı?
        if (resetToken.getUsed()) {
            return false;
        }
        
        // Token süresi dolmuş mu?
        if (resetToken.isExpired()) {
            return false;
        }
        
        return true;
    }
    
    // Şifreyi sıfırla
    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        // Token'ı doğrula
        if (!verifyResetToken(email, token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Yeni şifreyi hashle ve kaydet
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Token'ı kullanılmış olarak işaretle
        PasswordResetToken resetToken = 
            passwordResetTokenRepository.findByToken(token).get();
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
    
    // 6 haneli random token oluştur
    private String generateResetToken() {
        Random random = new Random();
        int token = 100000 + random.nextInt(900000); // 100000-999999 arası
        return String.valueOf(token);
    }

}