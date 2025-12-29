package com.proje.maps.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GroupDTO {
    
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String color;  // NEW FIELD
    private String category;
    private Integer memberCount;
    private Integer maxMembers;
    private Boolean isPrivate;
    private LocalDateTime createdAt;
    private UserDTO creator;
    private Boolean isMember;
    private List<UserDTO> members;
    private Integer blogCount;  // NEW FIELD
    
    // Constructors
    public GroupDTO() {
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
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Integer getMemberCount() {
        return memberCount;
    }
    
    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }
    
    public Integer getMaxMembers() {
        return maxMembers;
    }
    
    public void setMaxMembers(Integer maxMembers) {
        this.maxMembers = maxMembers;
    }
    
    public Boolean getIsPrivate() {
        return isPrivate;
    }
    
    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public UserDTO getCreator() {
        return creator;
    }
    
    public void setCreator(UserDTO creator) {
        this.creator = creator;
    }
    
    public Boolean getIsMember() {
        return isMember;
    }
    
    public void setIsMember(Boolean isMember) {
        this.isMember = isMember;
    }
    
    public List<UserDTO> getMembers() {
        return members;
    }
    
    public void setMembers(List<UserDTO> members) {
        this.members = members;
    }
    
    public Integer getBlogCount() {
        return blogCount;
    }
    
    public void setBlogCount(Integer blogCount) {
        this.blogCount = blogCount;
    }
    
    @Override
    public String toString() {
        return "GroupDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", memberCount=" + memberCount +
                '}';
    }
}