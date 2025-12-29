package com.proje.maps.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Route data as JSON string (start, end, waypoints, distance, duration)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String routeData;
    
    @Column(name = "start_location", nullable = false)
    private String startLocation;
    
    @Column(name = "end_location", nullable = false)
    private String endLocation;
    
    @Column(name = "distance_km")
    private Double distanceKm;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    // Share token for public link sharing
    @Column(name = "share_token", unique = true, length = 64)
    private String shareToken;
    
    // Owner of the route
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Users with whom the route is shared
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "route_shares",
        joinColumns = @JoinColumn(name = "route_id"),
        inverseJoinColumns = @JoinColumn(name = "shared_with_user_id")
    )
    private List<User> sharedWithUsers = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Route() {
    }
    
    public Route(String name, String description, String routeData, 
                 String startLocation, String endLocation, 
                 Double distanceKm, Integer durationMinutes, User user) {
        this.name = name;
        this.description = description;
        this.routeData = routeData;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.user = user;
        this.isPublic = false;
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
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public List<User> getSharedWithUsers() {
        return sharedWithUsers;
    }
    
    public void setSharedWithUsers(List<User> sharedWithUsers) {
        this.sharedWithUsers = sharedWithUsers;
    }
    
    public String getShareToken() {
        return shareToken;
    }
    
    public void setShareToken(String shareToken) {
        this.shareToken = shareToken;
    }
}
