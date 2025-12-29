package com.proje.maps.dto;

import jakarta.validation.constraints.NotBlank;

public class SaveRouteRequest {
    
    @NotBlank(message = "Route name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Route data is required")
    private String routeData;
    
    @NotBlank(message = "Start location is required")
    private String startLocation;
    
    @NotBlank(message = "End location is required")
    private String endLocation;
    
    private Double distanceKm;
    private Integer durationMinutes;
    private Boolean isPublic = false;
    
    // Constructors
    public SaveRouteRequest() {
    }
    
    // Getters and Setters
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
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}
