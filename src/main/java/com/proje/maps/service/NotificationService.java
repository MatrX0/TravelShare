package com.proje.maps.service;

import com.proje.maps.dto.NotificationDTO;
import com.proje.maps.repo.NotificationRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.Notification;
import com.proje.maps.resource.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserJpaRepository userRepository;
    
    /**
     * Create a new notification for a user
     */
    public void createNotification(Long userId, String type, String title, String message, Long relatedId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification(user, type, title, message, relatedId);
        notificationRepository.save(notification);
    }
    
    /**
     * Get all notifications for a user
     */
    public List<NotificationDTO> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        return notifications.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get unread notifications for a user
     */
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
        return notifications.stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get unread notification count
     */
    public Long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.countUnreadByUser(user);
    }
    
    /**
     * Mark a notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public int markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.markAllAsReadByUser(user);
    }
    
    /**
     * Delete read notifications
     */
    @Transactional
    public int deleteReadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.deleteReadNotificationsByUser(user);
    }
    
    /**
     * Delete a notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notificationRepository.delete(notification);
    }
}