package com.proje.maps.dto;

import jakarta.validation.constraints.NotBlank;

public class SendMessageRequest {
    
    @NotBlank(message = "Message cannot be empty")
    private String message;
    
    // Constructors
    public SendMessageRequest() {
    }
    
    public SendMessageRequest(String message) {
        this.message = message;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public String toString() {
        return "SendMessageRequest{message='" + message + "'}";
    }
}
