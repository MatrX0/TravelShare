package com.proje.maps.api;

import com.proje.maps.dto.ApiResponse;
import com.proje.maps.dto.NotificationDTO;
import com.proje.maps.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
@Tag(name = "Notifications", description = "Notification management APIs")
public class NotificationController extends BaseController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * Get all notifications for current user
     */
    @GetMapping
    @Operation(summary = "Get all notifications")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getAllNotifications() {
        try {
            Long userId = getCurrentUserId();
            List<NotificationDTO> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get unread notifications
     */
    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUnreadNotifications() {
        try {
            Long userId = getCurrentUserId();
            List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        try {
            Long userId = getCurrentUserId();
            Long count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(ApiResponse.success(count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            notificationService.markAsRead(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {
        try {
            Long userId = getCurrentUserId();
            notificationService.markAllAsRead(userId);
            return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Delete notification
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete notification")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            notificationService.deleteNotification(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Notification deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * Delete all read notifications
     */
    @DeleteMapping("/read")
    @Operation(summary = "Delete all read notifications")
    public ResponseEntity<ApiResponse<String>> deleteReadNotifications() {
        try {
            Long userId = getCurrentUserId();
            notificationService.deleteReadNotifications(userId);
            return ResponseEntity.ok(ApiResponse.success("Read notifications deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}