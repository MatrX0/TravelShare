package com.proje.maps.api;

import com.proje.maps.dto.ApiResponse;
import com.proje.maps.dto.UpdateProfileRequest;
import com.proje.maps.dto.UserProfileDTO;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
@Tag(name = "Profile", description = "User profile management APIs")
public class ProfileController extends BaseController {
    
    private final ProfileService profileService;
    
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }
    
    /**
     * Get current user's profile
     */
    @GetMapping("/me")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getCurrentUserProfile() {
        try {
            Long userId = getCurrentUserId();
            UserProfileDTO profile = profileService.getUserProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve profile: " + e.getMessage());
        }
    }
    
    /**
     * Get another user's profile by ID
     */
    @GetMapping("/{userId}")
    @Operation(summary = "Get another user's profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserProfile(@PathVariable Long userId) {
        try {
            UserProfileDTO profile = profileService.getUserProfile(userId);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve profile: " + e.getMessage());
        }
    }
    
    /**
     * Update current user's profile
     */
    @PutMapping("/me")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            Long userId = getCurrentUserId();
            UserProfileDTO profile = profileService.updateProfile(userId, request);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to update profile: " + e.getMessage());
        }
    }
}