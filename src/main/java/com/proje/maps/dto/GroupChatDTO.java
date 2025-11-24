package com.proje.maps.dto;

import java.time.LocalDateTime;

public class GroupChatDTO {
    
    private Long id;
    private Long groupId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String message;
    private LocalDateTime createdAt;
    
    // Constructors
    public GroupChatDTO() {
    }
    
    public GroupChatDTO(Long id, Long groupId, Long senderId, String senderName, String senderAvatar, String message, LocalDateTime createdAt) {
        this.id = id;
        this.groupId = groupId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderAvatar = senderAvatar;
        this.message = message;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getGroupId() {
        return groupId;
    }
    
    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
    
    public Long getSenderId() {
        return senderId;
    }
    
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }
    
    public String getSenderName() {
        return senderName;
    }
    
    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
    
    public String getSenderAvatar() {
        return senderAvatar;
    }
    
    public void setSenderAvatar(String senderAvatar) {
        this.senderAvatar = senderAvatar;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "GroupChatDTO{" +
                "id=" + id +
                ", groupId=" + groupId +
                ", senderName='" + senderName + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
