package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.service.FriendshipService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FriendshipController {
    
    private final FriendshipService friendshipService;
    
    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }
    
    // Get friends list
    @GetMapping
    public ResponseEntity<ApiResponse<List<FriendDTO>>> getFriends(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<FriendDTO> friends = friendshipService.getFriends(userId);
        return ResponseEntity.ok(ApiResponse.success(friends));
    }
    
    // Get pending requests
    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<FriendRequestDTO>>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<FriendRequestDTO> requests = friendshipService.getPendingRequests(userId);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }
    
    // Get sent requests
    @GetMapping("/requests/sent")
    public ResponseEntity<ApiResponse<List<FriendRequestDTO>>> getSentRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<FriendRequestDTO> requests = friendshipService.getSentRequests(userId);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }
    
    // Send friend request
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<FriendRequestDTO>> sendFriendRequest(
            @Valid @RequestBody SendFriendRequestRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            FriendRequestDTO friendRequest = friendshipService.sendFriendRequest(userId, request.getFriendUserId());
            return ResponseEntity.ok(ApiResponse.success("Friend request sent", friendRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Accept friend request
    @PostMapping("/accept/{requestId}")
    public ResponseEntity<ApiResponse<FriendDTO>> acceptFriendRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            FriendDTO friend = friendshipService.acceptFriendRequest(requestId, userId);
            return ResponseEntity.ok(ApiResponse.success("Friend request accepted", friend));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Reject friend request
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<ApiResponse<Void>> rejectFriendRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            friendshipService.rejectFriendRequest(requestId, userId);
            return ResponseEntity.ok(ApiResponse.success("Friend request rejected", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Remove friend
    @DeleteMapping("/{friendUserId}")
    public ResponseEntity<ApiResponse<Void>> removeFriend(
            @PathVariable Long friendUserId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            friendshipService.removeFriend(userId, friendUserId);
            return ResponseEntity.ok(ApiResponse.success("Friend removed", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Block user
    @PostMapping("/block/{blockedUserId}")
    public ResponseEntity<ApiResponse<Void>> blockUser(
            @PathVariable Long blockedUserId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            friendshipService.blockUser(userId, blockedUserId);
            return ResponseEntity.ok(ApiResponse.success("User blocked", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Check friendship status
    @GetMapping("/status/{friendUserId}")
    public ResponseEntity<ApiResponse<String>> getFriendshipStatus(
            @PathVariable Long friendUserId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        String status = friendshipService.getFriendshipStatus(userId, friendUserId);
        return ResponseEntity.ok(ApiResponse.success(status));
    }
    
    private Long getCurrentUserId(UserDetails userDetails) {
        return 1L; // TODO: Get from UserDetails
    }
}
