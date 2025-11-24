package com.proje.maps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendDirectMessageRequest {
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    @NotBlank(message = "Message cannot be empty")
    private String message;
    
    // Constructors
    public SendDirectMessageRequest() {
    }
    
    public SendDirectMessageRequest(Long receiverId, String message) {
        this.receiverId = receiverId;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    @Override
    public String toString() {
        return "SendDirectMessageRequest{receiverId=" + receiverId + '}';
    }
}
