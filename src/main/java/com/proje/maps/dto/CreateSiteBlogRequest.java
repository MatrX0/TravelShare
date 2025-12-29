package com.proje.maps.dto;

public class CreateSiteBlogRequest {
    
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    
    // Constructors
    public CreateSiteBlogRequest() {}
    
    public CreateSiteBlogRequest(String title, String content, String imageUrl, String category) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.category = category;
    }
    
    // Getters and Setters
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
}
