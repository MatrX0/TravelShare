package com.proje.maps.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GroupDetailDTO {
    
    private Long id;
    private String name;
    private String icon;
    private String color;
    private String description;
    private Integer memberCount;
    private Boolean isMember;
    private LocalDateTime createdAt;
    private List<GroupMemberDTO> members;
    private Integer blogCount;
    private Integer messageCount;
    
    // Constructors
    public GroupDetailDTO() {
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
    
    public List<GroupMemberDTO> getMembers() {
        return members;
    }
    
    public void setMembers(List<GroupMemberDTO> members) {
        this.members = members;
    }
    
    public Integer getBlogCount() {
        return blogCount;
    }
    
    public void setBlogCount(Integer blogCount) {
        this.blogCount = blogCount;
    }
    
    public Integer getMessageCount() {
        return messageCount;
    }
    
    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
}
