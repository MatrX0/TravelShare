package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Tag(name = "Profile", description = "User profile management endpoints")
public class ProfileController extends BaseController {
    
    private final UserJpaRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final ActivityGroupRepository activityGroupRepository;
    
    public ProfileController(
            UserJpaRepository userRepository,
            FriendshipRepository friendshipRepository,
            ActivityGroupRepository activityGroupRepository) {
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.activityGroupRepository = activityGroupRepository;
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Get profile with stats")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getMyProfile() {
        try {
            Long userId = getCurrentUserId();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserProfileDTO profile = buildProfileDTO(user);
            
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to get profile: " + e.getMessage());
        }
    }
    
    @PutMapping("/me")
    @Operation(summary = "Update current user profile", description = "Update bio, name, or avatar")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateMyProfile(
            @RequestBody UpdateProfileRequest request) {
        try {
            Long userId = getCurrentUserId();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update fields if provided
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                user.setName(request.getName().trim());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio().trim());
            }
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl().trim());
            }
            
            User updatedUser = userRepository.save(user);
            UserProfileDTO profile = buildProfileDTO(updatedUser);
            
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to update profile: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile by ID", description = "Get another user's public profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserProfileDTO profile = buildProfileDTO(user);
            
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (Exception e) {
            throw new BadRequestException("Failed to get user profile: " + e.getMessage());
        }
    }
    
    // Helper method to build UserProfileDTO with stats
    private UserProfileDTO buildProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setUniqueId(user.getUniqueId());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        
        // Calculate stats
        // Friend count (accepted friendships)
        Long friendCountLong = friendshipRepository.countAcceptedFriends(user.getId());
        dto.setFriendCount(friendCountLong != null ? friendCountLong.intValue() : 0);
        
        // Get user's groups
        List<ActivityGroup> userGroups = user.getGroups();
        dto.setGroupCount(userGroups.size());
        
        // Convert groups to DTOs
        List<GroupDTO> groupDTOs = userGroups.stream()
                .map(this::toGroupDTO)
                .collect(Collectors.toList());
        dto.setGroups(groupDTOs);
        
        return dto;
    }
    
    // Helper to convert ActivityGroup to GroupDTO
    private GroupDTO toGroupDTO(ActivityGroup group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setIcon(group.getIcon());
        // ActivityGroup doesn't have category field
        dto.setMemberCount(group.getMembers() != null ? group.getMembers().size() : 0);
        dto.setCreatedAt(group.getCreatedAt());
        return dto;
    }
}
