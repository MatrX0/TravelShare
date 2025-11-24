package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.service.DirectMessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DirectMessageController {
    
    private final DirectMessageService messageService;
    
    public DirectMessageController(DirectMessageService messageService) {
        this.messageService = messageService;
    }
    
    // Get all conversations (inbox)
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> getAllConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<ConversationDTO> conversations = messageService.getAllConversations(userId);
        return ResponseEntity.ok(ApiResponse.success(conversations));
    }
    
    // Get conversation with specific user
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<DirectMessageDTO>>> getConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long currentUserId = getCurrentUserId(userDetails);
            List<DirectMessageDTO> messages = messageService.getConversation(currentUserId, userId);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Send message
    @PostMapping
    public ResponseEntity<ApiResponse<DirectMessageDTO>> sendMessage(
            @Valid @RequestBody SendDirectMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long senderId = getCurrentUserId(userDetails);
            DirectMessageDTO message = messageService.sendMessage(senderId, request);
            return ResponseEntity.ok(ApiResponse.success("Message sent", message));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Get unread messages
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<DirectMessageDTO>>> getUnreadMessages(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        List<DirectMessageDTO> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }
    
    // Get unread count
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getCurrentUserId(userDetails);
        Long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
    
    // Mark messages as read
    @PutMapping("/{senderId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long senderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long receiverId = getCurrentUserId(userDetails);
        messageService.markAsRead(receiverId, senderId);
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
    }
    
    // Mark single message as read
    @PutMapping("/{messageId}/read-one")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(
            @PathVariable Long messageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Delete conversation
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = getCurrentUserId(userDetails);
        messageService.deleteConversation(currentUserId, userId);
        return ResponseEntity.ok(ApiResponse.success("Conversation deleted", null));
    }
    
    private Long getCurrentUserId(UserDetails userDetails) {
        return 1L; // TODO: Get from UserDetails
    }
}
