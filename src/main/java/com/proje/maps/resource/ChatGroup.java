package com.proje.maps.resource;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class ChatGroup {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<Message> messages;

    // (mappedBy = "user") theres no need for this bc theres already a mapp on User side
    @ManyToMany
    private List<User> participants;
    
    public ChatGroup(Integer id, String name, List<User> participants, List<Message> messages) {
    
        this.id = id;
        this.name = name;
        this.participants = participants;
        this.messages = messages;
    }

    public ChatGroup() {}
    
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getUsers() {
        return participants;
    }

    public void setUsers(List<User> participants) {
        this.participants = participants;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    
    

    



}
