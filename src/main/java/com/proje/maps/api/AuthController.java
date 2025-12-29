package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.service.AuthService;
import com.proje.maps.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proje.maps.dto.ForgotPasswordRequest;
import com.proje.maps.dto.VerifyResetTokenRequest;
import com.proje.maps.dto.ResetPasswordRequest;
import com.proje.maps.dto.ContactRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
public class AuthController {
    
    private final AuthService authService;
    private final EmailService emailService;
    
    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid email or password"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String token = authService.requestPasswordReset(request.getEmail());
            return ResponseEntity.ok(
                ApiResponse.success("Password reset code generated", token)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/verify-reset-token")
    public ResponseEntity<ApiResponse<Void>> verifyResetToken(
            @Valid @RequestBody VerifyResetTokenRequest request) {
        try {
            boolean valid = authService.verifyResetToken(
                request.getEmail(), 
                request.getToken()
            );
            if (valid) {
                return ResponseEntity.ok(
                    ApiResponse.success("Token is valid", null)
                );
            } else {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid or expired token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(
                request.getEmail(),
                request.getToken(),
                request.getNewPassword()
            );
            return ResponseEntity.ok(
                ApiResponse.success("Password reset successfully", null)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> contact(
            @Valid @RequestBody ContactRequest request) {
        try {
            emailService.sendContactFormEmail(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
            );
            return ResponseEntity.ok(
                ApiResponse.success("Message sent successfully", null)
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to send message: " + e.getMessage()));
        }
    }

}