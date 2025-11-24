package com.proje.maps.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserProfileDTO {
    
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private LocalDateTime createdAt;
    private Integer groupCount;
    private Integer friendCount;
    private Integer blogCount;
    private List<GroupDTO> groups;
    private List<FriendDTO> friends;
    private List<GroupBlogDTO> recentBlogs;
    private String friendshipStatus; // null, PENDING, ACCEPTED, BLOCKED (for viewing other profiles)
    
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
    
    public Integer getGroupCount() {
        return groupCount;
    }
    
    public void setGroupCount(Integer groupCount) {
        this.groupCount = groupCount;
    }
    
    public Integer getFriendCount() {
        return friendCount;
    }
    
    public void setFriendCount(Integer friendCount) {
        this.friendCount = friendCount;
    }
    
    public Integer getBlogCount() {
        return blogCount;
    }
    
    public void setBlogCount(Integer blogCount) {
        this.blogCount = blogCount;
    }
    
    public List<GroupDTO> getGroups() {
        return groups;
    }
    
    public void setGroups(List<GroupDTO> groups) {
        this.groups = groups;
    }
    
    public List<FriendDTO> getFriends() {
        return friends;
    }
    
    public void setFriends(List<FriendDTO> friends) {
        this.friends = friends;
    }
    
    public List<GroupBlogDTO> getRecentBlogs() {
        return recentBlogs;
    }
    
    public void setRecentBlogs(List<GroupBlogDTO> recentBlogs) {
        this.recentBlogs = recentBlogs;
    }
    
    public String getFriendshipStatus() {
        return friendshipStatus;
    }
    
    public void setFriendshipStatus(String friendshipStatus) {
        this.friendshipStatus = friendshipStatus;
    }
    
    @Override
    public String toString() {
        return "UserProfileDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", groupCount=" + groupCount +
                ", friendCount=" + friendCount +
                '}';
    }
}
