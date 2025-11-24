package com.proje.maps.dto;

import java.time.LocalDateTime;

public class GroupDTO {
    
    private Long id;
    private String name;
    private String icon;
    private String color;
    private String description;
    private Integer memberCount;
    private Boolean isMember; // Giriş yapan kullanıcı üye mi?
    private LocalDateTime createdAt;
    
    // Constructors
    public GroupDTO() {
    }
    
    public GroupDTO(Long id, String name, String icon, String color, String description, Integer memberCount, Boolean isMember, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.description = description;
        this.memberCount = memberCount;
        this.isMember = isMember;
        this.createdAt = createdAt;
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
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public String getColor() {
        return color;
    }
    
    public void setColor(String color) {
        this.color = color;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getMemberCount() {
        return memberCount;
    }
    
    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }
    
    public Boolean getIsMember() {
        return isMember;
    }
    
    public void setIsMember(Boolean isMember) {
        this.isMember = isMember;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "GroupDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", icon='" + icon + '\'' +
                ", memberCount=" + memberCount +
                ", isMember=" + isMember +
                '}';
    }
}
