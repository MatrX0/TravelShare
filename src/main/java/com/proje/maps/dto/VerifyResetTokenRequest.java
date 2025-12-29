package com.proje.maps.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class VerifyResetTokenRequest {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Token is required")
    private String token;
    
    public VerifyResetTokenRequest() {
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
}
