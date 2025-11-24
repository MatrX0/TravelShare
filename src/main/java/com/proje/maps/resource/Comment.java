package com.proje.maps.resource;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {
    
    @JsonIgnore
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private User user;

    @JsonIgnore
    @ManyToOne
    private Blog blog;

    private String content;
    private LocalDateTime createdAt;


    public Comment(Integer id, User user, Blog blog, String content, LocalDateTime createdAt) {

        this.id = id;
        this.user = user;
        this.blog = blog;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Comment() {}


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public Blog getBlog() {
        return blog;
    }


    public void setBlog(Blog blog) {
        this.blog = blog;
    }


    public String getContent() {
        return content;
    }


    public void setContent(String content) {
        this.content = content;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    
    

}
