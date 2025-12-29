package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.exception.ResourceNotFoundException;
import com.proje.maps.service.ActivityGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
@Tag(name = "Activity Groups", description = "Activity group management endpoints")
public class ActivityGroupController extends BaseController {
    
    private final ActivityGroupService groupService;
    
    public ActivityGroupController(ActivityGroupService groupService) {
        this.groupService = groupService;
    }
    
    @GetMapping
    @Operation(summary = "Get all activity groups", description = "Retrieve all activity groups with membership status")
    public ResponseEntity<ApiResponse<List<GroupDTO>>> getAllGroups() {
        try {
            Long userId = isAuthenticated() ? getCurrentUserId() : null;
            List<GroupDTO> groups = groupService.getAllGroups(userId);
            return ResponseEntity.ok(ApiResponse.success(groups));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve groups: " + e.getMessage());
        }
    }
    
    @GetMapping("/{groupId}")
    @Operation(summary = "Get group details", description = "Get detailed information about a specific group")
    public ResponseEntity<ApiResponse<GroupDetailDTO>> getGroupDetail(@PathVariable Long groupId) {
        try {
            Long userId = isAuthenticated() ? getCurrentUserId() : null;
            GroupDetailDTO group = groupService.getGroupDetail(groupId, userId);
            
            if (group == null) {
                throw new ResourceNotFoundException("Activity Group", "id", groupId);
            }
            
            return ResponseEntity.ok(ApiResponse.success(group));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve group details: " + e.getMessage());
        }
    }
    
    @PostMapping
    @Operation(summary = "Create group", description = "Create a new activity group")
    public ResponseEntity<ApiResponse<GroupDTO>> createGroup(@Valid @RequestBody CreateGroupRequest request) {
        try {
            Long userId = getCurrentUserId();
            GroupDTO group = groupService.createGroup(request, userId);
            return ResponseEntity.ok(ApiResponse.success("Group created successfully", group));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to create group: " + e.getMessage());
        }
    }
    
    @PostMapping("/{groupId}/join")
    @Operation(summary = "Join a group", description = "Add current user to an activity group")
    public ResponseEntity<ApiResponse<GroupDTO>> joinGroup(@PathVariable Long groupId) {
        try {
            Long userId = getCurrentUserId();
            GroupDTO group = groupService.joinGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Successfully joined group", group));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to join group: " + e.getMessage());
        }
    }
    
    @PostMapping("/{groupId}/leave")
    @Operation(summary = "Leave a group", description = "Remove current user from an activity group")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(@PathVariable Long groupId) {
        try {
            Long userId = getCurrentUserId();
            System.out.println("[CONTROLLER] Leave group request - groupId: " + groupId + ", userId: " + userId);
            groupService.leaveGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Successfully left group", null));
        } catch (RuntimeException e) {
            System.err.println("[CONTROLLER] Leave group error: " + e.getMessage());
            e.printStackTrace();
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            System.err.println("[CONTROLLER] Unexpected error: " + e.getMessage());
            e.printStackTrace();
            throw new BadRequestException("Failed to leave group: " + e.getMessage());
        }
    }
    
    @GetMapping("/{groupId}/members")
    @Operation(summary = "Get group members", description = "Retrieve all members of a specific group")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(@PathVariable Long groupId) {
        try {
            List<GroupMemberDTO> members = groupService.getGroupMembers(groupId);
            return ResponseEntity.ok(ApiResponse.success(members));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve group members: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-groups")
    @Operation(summary = "Get user's groups", description = "Retrieve all groups that the current user has joined")
    public ResponseEntity<ApiResponse<List<GroupDTO>>> getMyGroups() {
        try {
            Long userId = getCurrentUserId();
            List<GroupDTO> groups = groupService.getUserGroups(userId);
            return ResponseEntity.ok(ApiResponse.success(groups));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve user groups: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search groups", description = "Search groups by name or category")
    public ResponseEntity<ApiResponse<List<GroupDTO>>> searchGroups(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        try {
            Long userId = isAuthenticated() ? getCurrentUserId() : null;
            List<GroupDTO> groups = groupService.searchGroups(query, category, userId);
            return ResponseEntity.ok(ApiResponse.success(groups));
        } catch (Exception e) {
            throw new BadRequestException("Failed to search groups: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{groupId}")
    @Operation(summary = "Delete group", description = "Delete an activity group (admin/creator only)")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@PathVariable Long groupId) {
        try {
            Long userId = getCurrentUserId();
            groupService.deleteGroup(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success("Group deleted successfully", null));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete group: " + e.getMessage());
        }
    }
    
    @PutMapping("/{groupId}")
    @Operation(summary = "Update group", description = "Update group details (admin/creator only)")
    public ResponseEntity<ApiResponse<GroupDTO>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateGroupRequest request) {
        try {
            Long userId = getCurrentUserId();
            GroupDTO group = groupService.updateGroup(groupId, request, userId);
            return ResponseEntity.ok(ApiResponse.success("Group updated successfully", group));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to update group: " + e.getMessage());
        }
    }
}