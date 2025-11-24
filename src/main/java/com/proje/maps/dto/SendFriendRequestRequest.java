package com.proje.maps.dto;

import jakarta.validation.constraints.NotNull;

public class SendFriendRequestRequest {
    
    @NotNull(message = "Friend user ID is required")
    private Long friendUserId;
    
    // Constructors
    public SendFriendRequestRequest() {
    }
    
    public SendFriendRequestRequest(Long friendUserId) {
        this.friendUserId = friendUserId;
    }
    
    // Getters and Setters
    public Long getFriendUserId() {
        return friendUserId;
    }
    
    public void setFriendUserId(Long friendUserId) {
        this.friendUserId = friendUserId;
    }
    
    @Override
    public String toString() {
        return "SendFriendRequestRequest{friendUserId=" + friendUserId + '}';
    }
}
