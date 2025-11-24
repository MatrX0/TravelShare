package com.proje.maps.dto;

import java.time.LocalDateTime;

public class FriendDTO {
    
    private Long userId;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String status; // PENDING, ACCEPTED, REJECTED, BLOCKED
    private LocalDateTime friendsSince;
    private Integer mutualFriendsCount;
    
    // Constructors
    public FriendDTO() {
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
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
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getFriendsSince() {
        return friendsSince;
    }
    
    public void setFriendsSince(LocalDateTime friendsSince) {
        this.friendsSince = friendsSince;
    }
    
    public Integer getMutualFriendsCount() {
        return mutualFriendsCount;
    }
    
    public void setMutualFriendsCount(Integer mutualFriendsCount) {
        this.mutualFriendsCount = mutualFriendsCount;
    }
    
    @Override
    public String toString() {
        return "FriendDTO{" +
                "userId=" + userId +
                ", name='" + name + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
