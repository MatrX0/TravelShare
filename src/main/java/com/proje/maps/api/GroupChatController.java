package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.service.GroupChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GroupChatController {
    
    private final GroupChatService chatService;
    
    public GroupChatController(GroupChatService chatService) {
        this.chatService = chatService;
    }
    
    // Get group messages
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupChatDTO>>> getMessages(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            List<GroupChatDTO> messages = chatService.getGroupMessages(groupId, userId);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Send message
    @PostMapping
    public ResponseEntity<ApiResponse<GroupChatDTO>> sendMessage(
            @PathVariable Long groupId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            GroupChatDTO message = chatService.sendMessage(groupId, userId, request);
            return ResponseEntity.ok(ApiResponse.success("Message sent", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Get recent messages (for polling)
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<GroupChatDTO>>> getRecentMessages(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            List<GroupChatDTO> messages = chatService.getRecentMessages(groupId, userId, limit);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Delete message
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable Long groupId,
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            chatService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(ApiResponse.success("Message deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    private Long getCurrentUserId(UserDetails userDetails) {
        return 1L; // TODO: Get from UserDetails
    }
}
