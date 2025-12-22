package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.exception.ResourceNotFoundException;
import com.proje.maps.service.FriendshipService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Tag(name = "Friends", description = "Friendship management endpoints")
public class FriendshipController extends BaseController {
    
    private final FriendshipService friendshipService;
    
    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }
    
    @GetMapping
    @Operation(summary = "Get friends list", description = "Retrieve all friends of the current user")
    public ResponseEntity<ApiResponse<List<FriendDTO>>> getFriends() {
        try {
            Long userId = getCurrentUserId();
            List<FriendDTO> friends = friendshipService.getFriends(userId);
            return ResponseEntity.ok(ApiResponse.success(friends));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve friends: " + e.getMessage());
        }
    }
    
    @GetMapping("/requests")
    @Operation(summary = "Get pending requests", description = "Retrieve all pending friend requests received by the current user")
    public ResponseEntity<ApiResponse<List<FriendRequestDTO>>> getPendingRequests() {
        try {
            Long userId = getCurrentUserId();
            List<FriendRequestDTO> requests = friendshipService.getPendingRequests(userId);
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve pending requests: " + e.getMessage());
        }
    }
    
    @GetMapping("/requests/sent")
    @Operation(summary = "Get sent requests", description = "Retrieve all friend requests sent by the current user")
    public ResponseEntity<ApiResponse<List<FriendRequestDTO>>> getSentRequests() {
        try {
            Long userId = getCurrentUserId();
            List<FriendRequestDTO> requests = friendshipService.getSentRequests(userId);
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve sent requests: " + e.getMessage());
        }
    }
    
    @PostMapping("/request")
    @Operation(summary = "Send friend request", description = "Send a friend request to another user")
    public ResponseEntity<ApiResponse<FriendRequestDTO>> sendFriendRequest(
            @Valid @RequestBody SendFriendRequestRequest request) {
        try {
            Long userId = getCurrentUserId();
            
            // Prevent sending request to self
            if (userId.equals(request.getFriendUserId())) {
                throw new BadRequestException("Cannot send friend request to yourself");
            }
            
            FriendRequestDTO friendRequest = friendshipService.sendFriendRequest(
                userId, request.getFriendUserId()
            );
            return ResponseEntity.ok(ApiResponse.success("Friend request sent", friendRequest));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to send friend request: " + e.getMessage());
        }
    }
    
    @PostMapping("/accept/{requestId}")
    @Operation(summary = "Accept friend request", description = "Accept a pending friend request")
    public ResponseEntity<ApiResponse<FriendDTO>> acceptFriendRequest(@PathVariable Long requestId) {
        try {
            Long userId = getCurrentUserId();
            FriendDTO friend = friendshipService.acceptFriendRequest(requestId, userId);
            return ResponseEntity.ok(ApiResponse.success("Friend request accepted", friend));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to accept friend request: " + e.getMessage());
        }
    }
    
    @PostMapping("/reject/{requestId}")
    @Operation(summary = "Reject friend request", description = "Reject a pending friend request")
    public ResponseEntity<ApiResponse<Void>> rejectFriendRequest(@PathVariable Long requestId) {
        try {
            Long userId = getCurrentUserId();
            friendshipService.rejectFriendRequest(requestId, userId);
            return ResponseEntity.ok(ApiResponse.success("Friend request rejected", null));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to reject friend request: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{friendUserId}")
    @Operation(summary = "Remove friend", description = "Remove a user from friends list")
    public ResponseEntity<ApiResponse<Void>> removeFriend(@PathVariable Long friendUserId) {
        try {
            Long userId = getCurrentUserId();
            friendshipService.removeFriend(userId, friendUserId);
            return ResponseEntity.ok(ApiResponse.success("Friend removed", null));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to remove friend: " + e.getMessage());
        }
    }
    
    @PostMapping("/block/{blockedUserId}")
    @Operation(summary = "Block user", description = "Block a user from sending messages or friend requests")
    public ResponseEntity<ApiResponse<Void>> blockUser(@PathVariable Long blockedUserId) {
        try {
            Long userId = getCurrentUserId();
            
            // Prevent blocking self
            if (userId.equals(blockedUserId)) {
                throw new BadRequestException("Cannot block yourself");
            }
            
            friendshipService.blockUser(userId, blockedUserId);
            return ResponseEntity.ok(ApiResponse.success("User blocked", null));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to block user: " + e.getMessage());
        }
    }
    
    @PostMapping("/unblock/{blockedUserId}")
    @Operation(summary = "Unblock user", description = "Unblock a previously blocked user")
    public ResponseEntity<ApiResponse<Void>> unblockUser(@PathVariable Long blockedUserId) {
        try {
            Long userId = getCurrentUserId();
            friendshipService.unblockUser(userId, blockedUserId);
            return ResponseEntity.ok(ApiResponse.success("User unblocked", null));
        } catch (Exception e) {
            throw new BadRequestException("Failed to unblock user: " + e.getMessage());
        }
    }
    
    @GetMapping("/status/{friendUserId}")
    @Operation(summary = "Check friendship status", description = "Get friendship status with another user")
    public ResponseEntity<ApiResponse<String>> getFriendshipStatus(@PathVariable Long friendUserId) {
        try {
            Long userId = getCurrentUserId();
            String status = friendshipService.getFriendshipStatus(userId, friendUserId);
            return ResponseEntity.ok(ApiResponse.success(status));
        } catch (Exception e) {
            throw new BadRequestException("Failed to get friendship status: " + e.getMessage());
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search for users by name or email")
    public ResponseEntity<ApiResponse<List<UserDTO>>> searchUsers(@RequestParam String query) {
        try {
            Long userId = getCurrentUserId();
            List<UserDTO> users = friendshipService.searchUsers(query, userId);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            throw new BadRequestException("Failed to search users: " + e.getMessage());
        }
    }

    @PostMapping("/request/by-unique-id")
    @Operation(summary = "Send friend request by Unique ID", description = "Send a friend request using user's unique ID (e.g., username#1234)")
    public ResponseEntity<ApiResponse<FriendRequestDTO>> sendFriendRequestByUniqueId(
            @RequestParam String uniqueId) {
        try {
            Long userId = getCurrentUserId();
            FriendRequestDTO friendRequest = friendshipService.sendFriendRequestByUniqueId(userId, uniqueId);
            return ResponseEntity.ok(ApiResponse.success("Friend request sent", friendRequest));
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to send friend request: " + e.getMessage());
        }
    }
    
    @GetMapping("/search/by-unique-id")
    @Operation(summary = "Search user by Unique ID", description = "Find a user by their unique ID")
    public ResponseEntity<ApiResponse<UserDTO>> searchByUniqueId(@RequestParam String uniqueId) {
        try {
            UserDTO user = friendshipService.findUserByUniqueId(uniqueId);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            throw new ResourceNotFoundException("User not found with Unique ID: " + uniqueId);
        }
    }

}
