package com.proje.maps.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserProfileDTO {
    
    private Long id;
    private String name;
    private String email;
    private String uniqueId;
    private String avatarUrl;
    private String bio;
    private LocalDateTime createdAt;
    
    // Stats
    private Integer friendCount;
    private Integer groupCount;
    private List<GroupDTO> groups;
    
    // Constructors
    public UserProfileDTO() {
    }
    
    // Getters and Setters
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
    
    public String getUniqueId() {
        return uniqueId;
    }
    
    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getFriendCount() {
        return friendCount;
    }
    
    public void setFriendCount(Integer friendCount) {
        this.friendCount = friendCount;
    }
    
    public Integer getGroupCount() {
        return groupCount;
    }
    
    public void setGroupCount(Integer groupCount) {
        this.groupCount = groupCount;
    }
    
    public List<GroupDTO> getGroups() {
        return groups;
    }
    
    public void setGroups(List<GroupDTO> groups) {
        this.groups = groups;
    }
}
