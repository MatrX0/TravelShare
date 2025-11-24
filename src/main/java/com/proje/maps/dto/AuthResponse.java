package com.proje.maps.dto;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserDTO user;
    
    // Constructors
    public AuthResponse() {
    }
    
    public AuthResponse(String token, String type, UserDTO user) {
        this.token = token;
        this.type = type;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                ", type='" + type + '\'' +
                ", user=" + user +
                '}';
    }
}
