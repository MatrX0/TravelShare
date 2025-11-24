package com.proje.maps.resource;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_chats")
public class GroupChat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private ActivityGroup group;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User sender;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public GroupChat() {
    }
    
    public GroupChat(ActivityGroup group, User sender, String message) {
        this.group = group;
        this.sender = sender;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ActivityGroup getGroup() {
        return group;
    }
    
    public void setGroup(ActivityGroup group) {
        this.group = group;
    }
    
    public User getSender() {
        return sender;
    }
    
    public void setSender(User sender) {
        this.sender = sender;
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
        return "GroupChat{" +
                "id=" + id +
                ", groupId=" + (group != null ? group.getId() : null) +
                ", senderId=" + (sender != null ? sender.getId() : null) +
                ", createdAt=" + createdAt +
                '}';
    }
}
