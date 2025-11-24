package com.proje.maps.resource;


// @Entity
public class MessageDTO {

    private String username;
    private Integer groupId;
    private String content;


    public MessageDTO(String username, Integer groupId, String content) {
        this.username = username;
        this.groupId = groupId;
        this.content = content;
    }

    public MessageDTO() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    
    
}
