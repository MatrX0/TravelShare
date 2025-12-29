package com.proje.maps.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @NotBlank(message = "Password is required")
    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "role", length = 20, nullable = false)
    private String role = "USER"; // USER or ADMIN
    
    // Many-to-Many with ActivityGroups
    @JsonIgnore
    @ManyToMany(mappedBy = "members")
    private List<ActivityGroup> groups = new ArrayList<>();
    
    // One-to-Many with GroupChats
    @JsonIgnore
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupChat> groupChats = new ArrayList<>();
    
    // One-to-Many with GroupBlogs
    @JsonIgnore
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupBlog> groupBlogs = new ArrayList<>();
    
    // One-to-Many with Friendships (as user)
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> sentFriendRequests = new ArrayList<>();
    
    // One-to-Many with Friendships (as friend)
    @JsonIgnore
    @OneToMany(mappedBy = "friend", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> receivedFriendRequests = new ArrayList<>();
    
    // One-to-Many with DirectMessages (as sender)
    @JsonIgnore
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DirectMessage> sentMessages = new ArrayList<>();
    
    // One-to-Many with DirectMessages (as receiver)
    @JsonIgnore
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DirectMessage> receivedMessages = new ArrayList<>();
    
    // One-to-Many with Notifications
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public User() {
    }
    
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.isActive = true;
    }
    
    // ==================== GETTERS ====================
    
    public Long getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public String getBio() {
        return bio;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public String getRole() {
        return role;
    }
    
    public List<ActivityGroup> getGroups() {
        return groups;
    }
    
    public List<GroupChat> getGroupChats() {
        return groupChats;
    }
    
    public List<GroupBlog> getGroupBlogs() {
        return groupBlogs;
    }
    
    public List<Friendship> getSentFriendRequests() {
        return sentFriendRequests;
    }
    
    public List<Friendship> getReceivedFriendRequests() {
        return receivedFriendRequests;
    }
    
    public List<DirectMessage> getSentMessages() {
        return sentMessages;
    }
    
    public List<DirectMessage> getReceivedMessages() {
        return receivedMessages;
    }

    public List<Notification> getNotifications() {
    return notifications;
    }
    
    // ==================== SETTERS ====================
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public void setGroups(List<ActivityGroup> groups) {
        this.groups = groups;
    }
    
    public void setGroupChats(List<GroupChat> groupChats) {
        this.groupChats = groupChats;
    }
    
    public void setGroupBlogs(List<GroupBlog> groupBlogs) {
        this.groupBlogs = groupBlogs;
    }
    
    public void setSentFriendRequests(List<Friendship> sentFriendRequests) {
        this.sentFriendRequests = sentFriendRequests;
    }
    
    public void setReceivedFriendRequests(List<Friendship> receivedFriendRequests) {
        this.receivedFriendRequests = receivedFriendRequests;
    }
    
    public void setSentMessages(List<DirectMessage> sentMessages) {
        this.sentMessages = sentMessages;
    }
    
    public void setReceivedMessages(List<DirectMessage> receivedMessages) {
        this.receivedMessages = receivedMessages;
    }

    public void setNotifications(List<Notification> notifications) {
    this.notifications = notifications;
   }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", isActive=" + isActive +
                '}';
    }
}
