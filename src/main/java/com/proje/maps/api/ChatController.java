package com.proje.maps.api;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.proje.maps.repo.ChatGroupJpaRepository;
import com.proje.maps.repo.MessageJpaRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.ChatGroup;
import com.proje.maps.resource.Message;
import com.proje.maps.resource.MessageDTO;
import com.proje.maps.resource.User;

@Controller
public class ChatController {


    private SimpMessagingTemplate messagingTemplate;
    private ChatGroupJpaRepository groupRepository;
    private MessageJpaRepository messageRepository;
    private UserJpaRepository userRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatGroupJpaRepository groupRepository,
                          MessageJpaRepository messageRepository, UserJpaRepository userRepository) {
    
        this.messagingTemplate = messagingTemplate;
        this.groupRepository = groupRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(MessageDTO messageDTO) {
        
        User sender = userRepository.findByEmail(messageDTO.getUsername()).orElseThrow();
        ChatGroup group = groupRepository.findById(messageDTO.getGroupId()).orElseThrow();

        Message message = new Message();
        message.setContent(messageDTO.getContent());
        message.setSender(sender);
        message.setGroup(group);
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/group." + group.getId(), messageDTO);
    }
}
