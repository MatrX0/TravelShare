package com.proje.maps.dto;

import java.time.LocalDateTime;

public class SiteBlogDTO {
    
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    private LocalDateTime createdAt;
    private Long authorId;
    private String authorName;
    private String authorEmail;
    
    // Constructors
    public SiteBlogDTO() {}
    
    public SiteBlogDTO(Long id, String title, String content, String imageUrl, String category, 
                       LocalDateTime createdAt, Long authorId, String authorName, String authorEmail) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.category = category;
        this.createdAt = createdAt;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
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
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public String getAuthorEmail() {
        return authorEmail;
    }
    
    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }
}
