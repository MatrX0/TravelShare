package com.proje.maps.dto;

public class UpdateProfileRequest {
    
    private String name;
    private String bio;
    private String avatarUrl;
    
    // Constructors
    public UpdateProfileRequest() {
    }
    
    public UpdateProfileRequest(String name, String bio, String avatarUrl) {
        this.name = name;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    @Override
    public String toString() {
        return "UpdateProfileRequest{name='" + name + "'}";
    }
}
