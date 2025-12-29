package com.proje.maps.resource;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_blogs")
public class SiteBlog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(nullable = false, length = 50)
    private String category; // DESTINATIONS, TIPS, GUIDES
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    // Constructors
    public SiteBlog() {
        this.createdAt = LocalDateTime.now();
    }
    
    public SiteBlog(String title, String content, String imageUrl, String category, User author) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.category = category;
        this.author = author;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public User getAuthor() {
        return author;
    }
    
    public void setAuthor(User author) {
        this.author = author;
    }
}
