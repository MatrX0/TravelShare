package com.proje.maps.dto;

import java.time.LocalDateTime;

public class ConversationDTO {
    
    private OtherUserInfo otherUser;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Integer unreadCount;
    
    // Inner class for otherUser structure
    public static class OtherUserInfo {
        private Long id;
        private String name;
        private String email;
        private String avatarUrl;
        
        public OtherUserInfo() {
        }
        
        public OtherUserInfo(Long id, String name, String email, String avatarUrl) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.avatarUrl = avatarUrl;
        }
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getAvatarUrl() {
            return avatarUrl;
        }
        
        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }
    
    // Constructors
    public ConversationDTO() {
    }
    
    // Getters and Setters
    public OtherUserInfo getOtherUser() {
        return otherUser;
    }
    
    public void setOtherUser(OtherUserInfo otherUser) {
        this.otherUser = otherUser;
    }
    
    public String getLastMessage() {
        return lastMessage;
    }
    
    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }
    
    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }
    
    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
    
    public Integer getUnreadCount() {
        return unreadCount;
    }
    
    public void setUnreadCount(Integer unreadCount) {
        this.unreadCount = unreadCount;
    }
    
    @Override
    public String toString() {
        return "ConversationDTO{" +
                "otherUser=" + (otherUser != null ? otherUser.getName() : null) +
                ", unreadCount=" + unreadCount +
                '}';
    }
}