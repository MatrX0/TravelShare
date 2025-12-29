package com.proje.maps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendDirectMessageRequest {
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    @NotBlank(message = "Message content cannot be empty")
    private String content;
    
    // Constructors
    public SendDirectMessageRequest() {
    }
    
    public SendDirectMessageRequest(Long receiverId, String content) {
        this.receiverId = receiverId;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getReceiverId() {
        return receiverId;
    }
    
    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    @Override
    public String toString() {
        return "SendDirectMessageRequest{receiverId=" + receiverId + '}';
    }
}