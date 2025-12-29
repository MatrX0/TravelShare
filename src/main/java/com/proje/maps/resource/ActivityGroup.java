package com.proje.maps.resource;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activity_groups")
public class ActivityGroup {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 100)
    private String icon;
    
    @Column(length = 50)
    private String color;
    
    @Column(length = 50)
    private String category;
    
    @Column(name = "max_members")
    private Integer maxMembers;
    
    @Column(name = "is_private")
    private Boolean isPrivate = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
    
    @ManyToMany
    @JoinTable(
        name = "group_members",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public ActivityGroup() {
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Integer getMaxMembers() {
        return maxMembers;
    }
    
    public void setMaxMembers(Integer maxMembers) {
        this.maxMembers = maxMembers;
    }
    
    public Boolean getIsPrivate() {
        return isPrivate;
    }
    
    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    public User getCreator() {
        return creator;
    }
    
    public void setCreator(User creator) {
        this.creator = creator;
    }
    
    public List<User> getMembers() {
        return members;
    }
    
    public void setMembers(List<User> members) {
        this.members = members;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Helper methods
    public void addMember(User user) {
        if (!this.members.contains(user)) {
            this.members.add(user);
            user.getGroups().add(this);
        }
    }
    
    public void removeMember(User user) {
        this.members.remove(user);
        user.getGroups().remove(this);
    }
    
    @Override
    public String toString() {
        return "ActivityGroup{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", memberCount=" + (members != null ? members.size() : 0) +
                '}';
    }
}