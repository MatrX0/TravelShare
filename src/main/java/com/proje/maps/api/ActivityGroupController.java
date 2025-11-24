package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.User;
import com.proje.maps.service.ActivityGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ActivityGroupController {

    private final ActivityGroupService groupService;
    private final UserJpaRepository userRepository;

    public ActivityGroupController(ActivityGroupService groupService, UserJpaRepository userRepository) {
        this.groupService = groupService;
        this.userRepository = userRepository;
    }
    
    // Get all groups
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupDTO>>> getAllGroups(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<GroupDTO> groups = groupService.getAllGroups(userId);
        return ResponseEntity.ok(ApiResponse.success(groups));
    }
    
    // Get group detail
    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupDetailDTO>> getGroupDetail(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        GroupDetailDTO group = groupService.getGroupDetail(groupId, userId);
        return ResponseEntity.ok(ApiResponse.success(group));
    }
    
    // Join group
    @PostMapping("/{groupId}/join")
    public ResponseEntity<ApiResponse<GroupDTO>> joinGroup(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            GroupDTO group = groupService.joinGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Successfully joined group", group));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Leave group
    @PostMapping("/{groupId}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            groupService.leaveGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Successfully left group", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Get group members
    @GetMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(
            @PathVariable Long groupId) {
        List<GroupMemberDTO> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(ApiResponse.success(members));
    }
    
    // Get user's groups
    @GetMapping("/my-groups")
    public ResponseEntity<ApiResponse<List<GroupDTO>>> getMyGroups(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<GroupDTO> groups = groupService.getUserGroups(userId);
        return ResponseEntity.ok(ApiResponse.success(groups));
    }
    
    // Helper method
    private Long getCurrentUserId(UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("User not authenticated");
        }

        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}
