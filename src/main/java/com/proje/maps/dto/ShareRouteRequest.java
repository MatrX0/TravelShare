package com.proje.maps.dto;

import java.util.List;

public class ShareRouteRequest {
    
    private List<Long> friendIds; // List of friend user IDs to share with
    
    // Constructors
    public ShareRouteRequest() {
    }
    
    // Getters and Setters
    public List<Long> getFriendIds() {
        return friendIds;
    }
    
    public void setFriendIds(List<Long> friendIds) {
        this.friendIds = friendIds;
    }
}
