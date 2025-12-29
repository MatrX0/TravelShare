package com.proje.maps.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RouteDTO {
    
    private Long id;
    private String name;
    private String description;
    private String routeData;
    private String startLocation;
    private String endLocation;
    private Double distanceKm;
    private Integer durationMinutes;
    private LocalDateTime createdAt;
    private Boolean isPublic;
    private Long userId;
    private String userName;
    private List<Long> sharedWithUserIds;
    private String shareToken;
    
    // Constructors
    public RouteDTO() {
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getRouteData() {
        return routeData;
    }
    
    public void setRouteData(String routeData) {
        this.routeData = routeData;
    }
    
    public String getStartLocation() {
        return startLocation;
    }
    
    public void setStartLocation(String startLocation) {
        this.startLocation = startLocation;
    }
    
    public String getEndLocation() {
        return endLocation;
    }
    
    public void setEndLocation(String endLocation) {
        this.endLocation = endLocation;
    }
    
    public Double getDistanceKm() {
        return distanceKm;
    }
    
    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public List<Long> getSharedWithUserIds() {
        return sharedWithUserIds;
    }
    
    public void setSharedWithUserIds(List<Long> sharedWithUserIds) {
        this.sharedWithUserIds = sharedWithUserIds;
    }
    
    public String getShareToken() {
        return shareToken;
    }
    
    public void setShareToken(String shareToken) {
        this.shareToken = shareToken;
    }
}
