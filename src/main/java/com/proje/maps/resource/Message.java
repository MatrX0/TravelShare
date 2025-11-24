package com.proje.maps.resource;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {

    @Id
    @GeneratedValue
    private Integer id;
    private LocalDateTime timestamp;
    private String content;

    @ManyToOne
    private User sender;

    @ManyToOne
    private ChatGroup group;

    public Message(LocalDateTime timestamp, String content, Integer id, User sender, ChatGroup group) {
        this.timestamp = timestamp;
        this.content = content;
        this.id = id;
        this.sender = sender;
        this.group = group;
    }

    public Message() {}

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public ChatGroup getGroup() {
        return group;
    }

    public void setGroup(ChatGroup group) {
        this.group = group;
    }

    


    
}
