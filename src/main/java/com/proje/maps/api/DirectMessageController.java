package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.exception.BadRequestException;
import com.proje.maps.exception.UnauthorizedException;
import com.proje.maps.service.DirectMessageService;
import com.proje.maps.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
@Tag(name = "Direct Messages", description = "Direct messaging endpoints")
public class DirectMessageController extends BaseController {
    
    private final DirectMessageService messageService;
    private final NotificationService notificationService;
    
    public DirectMessageController(DirectMessageService messageService,
                                   NotificationService notificationService) {
        this.messageService = messageService;
        this.notificationService = notificationService;
    }
    
    @GetMapping
    @Operation(summary = "Get all conversations", description = "Retrieve all conversation threads for the current user")
    public ResponseEntity<ApiResponse<List<ConversationDTO>>> getAllConversations() {
        try {
            Long userId = getCurrentUserId();
            List<ConversationDTO> conversations = messageService.getAllConversations(userId);
            return ResponseEntity.ok(ApiResponse.success(conversations));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve conversations: " + e.getMessage());
        }
    }
    
    @GetMapping("/{userId}")
    @Operation(summary = "Get conversation with user", description = "Retrieve all messages in a conversation with a specific user")
    public ResponseEntity<ApiResponse<List<DirectMessageDTO>>> getConversation(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Prevent getting conversation with self
            if (currentUserId.equals(userId)) {
                throw new BadRequestException("Cannot get conversation with yourself");
            }
            
            List<DirectMessageDTO> messages = messageService.getConversation(currentUserId, userId);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve conversation: " + e.getMessage());
        }
    }
    
    @PostMapping
    @Operation(summary = "Send message", description = "Send a direct message to another user")
    public ResponseEntity<ApiResponse<DirectMessageDTO>> sendMessage(
            @Valid @RequestBody SendDirectMessageRequest request) {
        try {
            Long senderId = getCurrentUserId();
            
            // Prevent sending message to self
            if (senderId.equals(request.getReceiverId())) {
                throw new BadRequestException("Cannot send message to yourself");
            }
            
            // Validate message content
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                throw new BadRequestException("Message content cannot be empty");
            }
            
            if (request.getContent().length() > 1000) {
                throw new BadRequestException("Message content too long (max 1000 characters)");
            }
            
            DirectMessageDTO message = messageService.sendMessage(senderId, request);
            
            // ✨ YENİ: Bildirim oluştur
            try {
                // Mesaj içeriğinden kısa bir önizleme oluştur
                String content = request.getContent();
                String preview = content.length() > 50 
                    ? content.substring(0, 50) + "..." 
                    : content;
                
                notificationService.createNotification(
                    request.getReceiverId(),     // Kime? → Mesaj alan kişi
                    "MESSAGE",                   // Ne?
                    "New Message",               // Başlık
                    preview,                     // Mesaj önizlemesi
                    message.getId()              // İlgili mesaj ID
                );
            } catch (Exception e) {
                System.err.println("Failed to create notification: " + e.getMessage());
            }
            
            return ResponseEntity.ok(ApiResponse.success("Message sent", message));
        } catch (BadRequestException e) {
            throw e;
        } catch (IllegalStateException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            throw new BadRequestException("Failed to send message: " + e.getMessage());
        }
    }
    
    @GetMapping("/unread")
    @Operation(summary = "Get unread messages", description = "Retrieve all unread messages for the current user")
    public ResponseEntity<ApiResponse<List<DirectMessageDTO>>> getUnreadMessages() {
        try {
            Long userId = getCurrentUserId();
            List<DirectMessageDTO> messages = messageService.getUnreadMessages(userId);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve unread messages: " + e.getMessage());
        }
    }
    
    @GetMapping("/unread/count")
    @Operation(summary = "Get unread count", description = "Get total count of unread messages")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        try {
            Long userId = getCurrentUserId();
            Long count = messageService.getUnreadCount(userId);
            return ResponseEntity.ok(ApiResponse.success(count));
        } catch (Exception e) {
            throw new BadRequestException("Failed to get unread count: " + e.getMessage());
        }
    }
    
    @PutMapping("/{senderId}/read")
    @Operation(summary = "Mark messages as read", description = "Mark all messages from a specific user as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long senderId) {
        try {
            Long receiverId = getCurrentUserId();
            messageService.markAsRead(receiverId, senderId);
            return ResponseEntity.ok(ApiResponse.success("Messages marked as read", null));
        } catch (Exception e) {
            throw new BadRequestException("Failed to mark messages as read: " + e.getMessage());
        }
    }
    
    @PutMapping("/{messageId}/read-one")
    @Operation(summary = "Mark single message as read", description = "Mark a specific message as read")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(@PathVariable Long messageId) {
        try {
            Long userId = getCurrentUserId();
            messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok(ApiResponse.success("Message marked as read", null));
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to mark message as read: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete conversation", description = "Delete entire conversation thread with a user")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(@PathVariable Long userId) {
        try {
            Long currentUserId = getCurrentUserId();
            
            // Prevent deleting conversation with self
            if (currentUserId.equals(userId)) {
                throw new BadRequestException("Cannot delete conversation with yourself");
            }
            
            messageService.deleteConversation(currentUserId, userId);
            return ResponseEntity.ok(ApiResponse.success("Conversation deleted", null));
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete conversation: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/message/{messageId}")
    @Operation(summary = "Delete single message", description = "Delete a specific message")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long messageId) {
        try {
            Long userId = getCurrentUserId();
            messageService.deleteMessage(messageId, userId);
            return ResponseEntity.ok(ApiResponse.success("Message deleted", null));
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to delete message: " + e.getMessage());
        }
    }
}