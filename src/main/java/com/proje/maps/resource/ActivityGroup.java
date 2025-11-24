package com.proje.maps.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(nullable = false, length = 100)
    private String icon; // Emoji: 🥾, ⛰️, 🏕️, 🚗, 🏛️, 🏖️
    
    @Column(nullable = false, length = 20)
    private String color; // #10b981, #3b82f6, etc.
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Many-to-Many with Users
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "user_groups",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();
    
    // One-to-Many with GroupChats
    @JsonIgnore
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupChat> chats = new ArrayList<>();
    
    // One-to-Many with GroupBlogs
    @JsonIgnore
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupBlog> blogs = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public ActivityGroup() {
    }
    
    public ActivityGroup(String name, String icon, String color, String description) {
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.description = description;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<User> getMembers() {
        return members;
    }
    
    public void setMembers(List<User> members) {
        this.members = members;
    }
    
    public List<GroupChat> getChats() {
        return chats;
    }
    
    public void setChats(List<GroupChat> chats) {
        this.chats = chats;
    }
    
    public List<GroupBlog> getBlogs() {
        return blogs;
    }
    
    public void setBlogs(List<GroupBlog> blogs) {
        this.blogs = blogs;
    }
    
    // Helper methods
    public int getMemberCount() {
        return members != null ? members.size() : 0;
    }
    
    public void addMember(User user) {
        if (!members.contains(user)) {
            members.add(user);
        }
    }
    
    public void removeMember(User user) {
        members.remove(user);
    }
    
    @Override
    public String toString() {
        return "ActivityGroup{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", icon='" + icon + '\'' +
                ", memberCount=" + getMemberCount() +
                '}';
    }
}
